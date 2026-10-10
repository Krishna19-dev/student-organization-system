# Skyline Student Association (Student Organization System)

A unified student organization management platform for memberships, events, ticketing, merchandise, volunteer coordination, and single-ledger financial tracking. Built for the 24-hour hackathon.

## Tech Stack
- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript (Strict)
- **Styling**: Tailwind CSS + Custom Brand Tokens (`#714B67` Plum & `#017E84` Teal) + Lucide Icons
- **Database & ORM**: Neon Serverless PostgreSQL + Prisma ORM 6.x
- **Authentication**: JWT Sessions (`jose`) + `bcryptjs`
- **Validation**: Server-side Zod

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Product Modules
1. **Members & Membership Tiers**: Dues, expiry, renewal reminders
2. **Events & Tickets**: Member vs. guest pricing, seat limits, QR check-in
3. **Announcements**: Public broadcast and immutable history
4. **Merch Store**: Live size-wise inventory management
5. **Fundraiser Task Board**: Volunteer ownership & progress tracking
6. **Volunteer Expense Reimbursement**: Multi-stage approval flow
7. **Treasurer Vault**: Single-entry ledger with integer rupee precision
