// backend/src/scripts/createAdmin.js
// Run: node src/scripts/createAdmin.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const email = process.env.ADMIN_EMAIL || 'admin@trpg.local';
  const password = process.env.ADMIN_PASSWORD || 'changeme123';

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.upsert({
    where: { username },
    update: {},
    create: { username, email, password: hashed, role: 'ADMIN' }
  });
  console.log('✅ Admin created:', user.username, '/', password);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
