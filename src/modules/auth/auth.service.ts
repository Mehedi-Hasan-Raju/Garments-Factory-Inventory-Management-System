
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { prisma } from "../../lib/prisma.js";
import { generateAccessToken } from "../../utils/jwt.js";
import type { RegisterInput, LoginInput } from "./auth.validation.js";

export const registerOrganization = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("Email is already registered");
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const baseSlug = data.organizationName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const slug = `${baseSlug}-${randomUUID().slice(0, 8)}`;

  const result = await prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: {
        name: data.organizationName,
        slug,
        email: data.email,
      },
    });

    const user = await tx.user.create({
      data: {
        organizationId: organization.id,
        name: data.name,
        email: data.email,
        passwordHash,
        role: "OWNER",
        status: "ACTIVE",
      },
      select: {
        id: true,
        organizationId: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    return { organization, user };
  });

  const accessToken = generateAccessToken({
    userId: result.user.id,
    organizationId: result.user.organizationId,
    role: result.user.role,
  });

  return {
    user: result.user,
    organization: {
      id: result.organization.id,
      name: result.organization.name,
      slug: result.organization.slug,
    },
    accessToken,
  };
};

export const loginUser = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.passwordHash,
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  if (user.status !== "ACTIVE") {
    throw new Error("Your account is not active");
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    organizationId: user.organizationId,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      organizationId: user.organizationId,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
    accessToken,
  };
};
