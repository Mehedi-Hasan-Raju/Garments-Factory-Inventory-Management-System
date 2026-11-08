
import "dotenv/config";

import bcrypt from "bcryptjs";
import process from "node:process";
import { prisma } from "../src/lib/prisma.js";

const seedAdmin = async () => {
  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;
  const organizationName =
    process.env.ADMIN_ORGANIZATION_NAME?.trim() || "GarmentFlow";
  const organizationSlug =
    process.env.ADMIN_ORGANIZATION_SLUG?.trim() || "garmentflow";

  if (!name || !email || !password) {
    throw new Error(
      "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD are required",
    );
  }

  if (password.length < 12) {
    throw new Error("Admin password must be at least 12 characters");
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log("Admin account already exists.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: "OWNER",
      status: "ACTIVE",
      organization: {
        connectOrCreate: {
          where: { slug: organizationSlug },
          create: {
            name: organizationName,
            slug: organizationSlug,
          },
        },
      },
    },
  });

  console.log("Initial admin account created successfully.");
};

seedAdmin()
  .catch((error) => {
    console.error("Admin seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
