# Skyline Student Association: Backend Walkthrough

Welcome to the backend of the Skyline Student Association platform. This document explains exactly what we have built, how the different modules interact, and how the core business rules are strictly enforced at the database level.

## 1. The Core Philosophy

This backend is built on three unbreakable principles:
1. **The Unified Ledger (`LedgerEntry`)**: There are no disconnected spreadsheets. Every single cent that enters or leaves the club (Dues, Merch Sales, Ticket Sales, Sponsor Cash, Reimbursed Expenses) flows into **one single table**: `LedgerEntry`. The Treasurer dashboard instantly calculates Balances and P&L by reading directly from this single source of truth.
2. **Role-based Access by Office, not by Person**: Permissions are entirely separated from the user account. A user is given access strictly via an active `RoleAssignment` (e.g., `VP_EVENTS`, `TREASURER`, `PRESIDENT`). When an Admin elects a new officer, the old officer's `endDate` is instantly closed out in a database transaction, revoking their access immediately.
3. **Membership-Driven Pricing**: Pricing logic lives exclusively on the server. If a user tries to buy a hoodie or an event ticket, the frontend never sends the price. Instead, the `pricing.service.js` kicks in, checks if the user has an `ACTIVE`, unexpired membership, and applies the member discount automatically.

---

## 2. Walkthrough of Key Features

### 2.1 Joining the Club (Applications & Membership)
* **File Location**: `src/modules/applications/`
* **Flow**: 
  1. A `Guest` hits `/api/auth/register` to submit their details, desired role (Member vs. Lead), and skills. This creates an `Application` in `PAYMENT_PENDING` state.
  2. The user pays their dues via Razorpay. When payment is verified (`/api/applications/verify`), the application moves to `UNDER_REVIEW`, and the cash is logged to the Ledger as `DUES`.
  3. The Admin hits `/api/applications/admin/:id/approve`. In a single transaction:
     - The application is `APPROVED`.
     - An active `Membership` is created (valid for exactly one year).
     - A digital Member Code and `qrToken` are securely generated.
     - If they applied for a Lead position, a `VOLUNTEER` Role is instantly assigned.

### 2.2 Hosting an Event & Ticketing
* **File Location**: `src/modules/events/` and `src/services/ticket.service.js`
* **Flow**:
  1. `VP_EVENTS` creates a Spring Gala event (`totalSeats: 100`, `memberPrice: 100`, `guestPrice: 200`).
  2. A user checks out. **Crucial Rule**: We use an **Atomic Database Query** to prevent overselling. 
     ```sql
     UPDATE "Event" SET "seatsSold" = "seatsSold" + 1 
     WHERE id = :eventId AND "seatsSold" + 1 <= "totalSeats"
     ```
     If 100 people click "Buy" at the exact same millisecond for the last seat, PostgreSQL guarantees that exactly **one** person gets the seat. The other 99 receive a `409 Sold Out` error.
  3. Upon payment verification, a `Ticket` with a unique `qrToken` is generated.
  4. Volunteers scan tickets at the door via `/api/tickets/checkin`. The server flips the status from `VALID` to `USED` so a ticket can never be scanned twice.

### 2.3 The Merchandise Shop
* **File Location**: `src/modules/shop/` and `src/services/order.service.js`
* **Flow**:
  1. Both Guests and Members can browse the catalog.
  2. During checkout, if the user is a `Guest`, they pay full price. If they are a `Member`, `pricing.service.js` calculates the percentage discount.
  3. Just like event seats, Hoodie stock is updated atomically: `stock = stock - qty WHERE stock >= qty`. No negative stock is physically possible.
  4. Verified payments log as `MERCH` in the Ledger.

### 2.4 The Treasurer's Dashboard
* **File Location**: `src/modules/finance/` and `src/modules/expenses/`
* **Flow**:
  1. Volunteers upload receipts via Multer (`middleware/upload.js`) to submit an `ExpenseClaim`.
  2. The Treasurer reviews pending claims.
  3. When the Treasurer clicks "Pay", a Prisma transaction runs: the claim is marked `PAID`, and a negative `EXPENSE` entry is written to the Ledger.
  4. The `/api/finance/summary` endpoint uses Prisma aggregations (`_sum`) over the `LedgerEntry` table to instantly calculate the club's current cash balance without any complex math.

### 2.5 Governance & Security
* **File Location**: `src/modules/roles/` and `src/services/audit.service.js`
* **Flow**:
  - `PRESIDENT` is a seeded super-admin role.
  - When the President elects a new Treasurer, the `/api/roles/election` endpoint runs a transaction. It terminates the old Treasurer's access, initiates the new Treasurer, and logs the action in the `AuditLog` so all sensitive governance actions are permanently traceable.

---

## 3. How to Navigate the Codebase

- **`src/app.js`**: Starts here. This is where Express is configured and all the major domain routes (`/api/auth`, `/api/shop`, `/api/finance`, etc.) are mounted.
- **`src/middleware/`**: Contains the security guards. Look at `roles.js` to see how endpoints are shielded so only authorized officers can access them.
- **`src/services/`**: This is where the heavy lifting happens. Controllers don't write to the ledger—they ask `ledger.service.js` to do it. Controllers don't do math on prices—they ask `pricing.service.js`. This keeps the API routes extremely thin and testable.
- **`prisma/schema.prisma`**: The heart of the database structure containing all the constraints, unique tokens, and relational maps.

Enjoy exploring the Skyline Student Association backend!
