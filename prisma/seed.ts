import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "12345&eyachoukk",
    10
  );

  const admin = await prisma.admin.upsert({
    where: { username: process.env.ADMIN_USERNAME || "eyachoukk" },
    update: {},
    create: {
      username: process.env.ADMIN_USERNAME || "eyachoukk",
      password: hashedPassword,
      name: "Admin User",
    },
  });

  console.log("✅ Admin user created:", admin.username);
  console.log("🔐 Password:", process.env.ADMIN_PASSWORD || "12345&eyachoukk");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
