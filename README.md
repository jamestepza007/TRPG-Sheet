# ⚔ TRPG Sheet — Setup Guide

## Requirements
- Node.js 18+
- PostgreSQL database (Railway แนะนำ)

---

## Backend Setup

```bash
cd backend
npm install

# Copy และแก้ไข .env
cp .env.example .env
# แก้ไข DATABASE_URL, JWT_SECRET ใน .env

# Push database schema
npx prisma db push
npx prisma generate

# สร้าง Admin user แรก (รัน 1 ครั้ง)
node scripts/seed.js

# Start server
npm run dev        # development
npm start          # production
```

### Environment Variables (backend/.env)
```
DATABASE_URL="postgresql://user:password@host:5432/trpg_sheet"
JWT_SECRET="your-random-secret-key-here"
PORT=3001
FRONTEND_URL="http://localhost:5173"
```

---

## Frontend Setup

```bash
cd frontend
npm install

# Copy .env
cp .env.example .env
# แก้ไข VITE_API_URL ถ้า backend อยู่คนละ domain

npm run dev        # development
npm run build      # build for production
```

### Environment Variables (frontend/.env)
```
VITE_API_URL=http://localhost:3001/api
```

---

## Deploy บน Railway

1. สร้าง project ใหม่บน [Railway](https://railway.app)
2. เพิ่ม PostgreSQL service
3. Deploy backend จาก GitHub repo (folder: backend)
4. ตั้ง environment variables ใน Railway dashboard
5. Deploy frontend บน [Vercel](https://vercel.com) จาก folder frontend
6. แก้ไข `FRONTEND_URL` ใน backend ให้ตรงกับ Vercel URL
7. แก้ไข `VITE_API_URL` ใน frontend ให้ตรงกับ Railway URL

---

## สร้าง Admin User แรก

หลัง deploy รัน script นี้ 1 ครั้ง:

```bash
cd backend
node -e "
import('./src/scripts/createAdmin.js').catch(console.error)
"
```

หรือสร้างโดยตรงผ่าน Prisma Studio:
```bash
npx prisma studio
```

---

## Features

- 🎭 **Multi-system**: Dungeon World, Cyberpunk RED (+ Cain เพิ่มทีหลัง)
- 🎲 **Dice roller**: ทอยตาม system, modifier จาก stats, ส่ง Discord webhook
- 📋 **Character Sheet**: บันทึกออนไลน์, คำนวณ modifier อัตโนมัติ
- ⚔ **Campaign & Party**: GM สร้าง campaign, player เข้า party ด้วย invite code
- 👤 **Closed Registration**: Admin เพิ่ม user เอง
- 🎨 **Themed UI**: UI เปลี่ยนตาม system (Fantasy / Cyberpunk)

---

## Roles

| Role | สิทธิ์ |
|------|--------|
| ADMIN | จัดการ user ทั้งหมด, เห็นทุก campaign |
| GM | สร้าง campaign, เห็นข้อมูล player ใน campaign ตัวเอง |
| PLAYER | สร้าง character, เข้า party |

---

## Discord Webhook

1. ไปที่ Discord channel settings → Integrations → Webhooks
2. Create New Webhook → Copy URL
3. ใส่ URL ใน Profile → Discord Webhook
4. เปิด "Send to Discord" ตอนทอยลูกเต๋า
