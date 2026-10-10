const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const prismaDir = path.join(__dirname, 'prisma');

const files = [
  'lib/razorpay.js',
  'lib/mailer.js',
  'lib/qr.js',
  'middleware/auth.js',
  'middleware/roles.js',
  'middleware/validate.js',
  'middleware/upload.js',
  'services/ledger.service.js',
  'services/pricing.service.js',
  'services/membership.service.js',
  'services/application.service.js',
  'services/ticket.service.js',
  'services/order.service.js',
  'services/payment.service.js',
  'services/expense.service.js',
  'services/sponsor.service.js',
  'services/role.service.js',
  'services/audit.service.js',
  'modules/applications/applications.routes.js',
  'modules/applications/applications.controller.js',
  'modules/memberships/memberships.routes.js',
  'modules/memberships/memberships.controller.js',
  'modules/events/events.routes.js',
  'modules/events/events.controller.js',
  'modules/tickets/tickets.routes.js',
  'modules/tickets/tickets.controller.js',
  'modules/shop/shop.routes.js',
  'modules/shop/shop.controller.js',
  'modules/announcements/announcements.routes.js',
  'modules/announcements/announcements.controller.js',
  'modules/tasks/tasks.routes.js',
  'modules/tasks/tasks.controller.js',
  'modules/expenses/expenses.routes.js',
  'modules/expenses/expenses.controller.js',
  'modules/finance/finance.routes.js',
  'modules/finance/finance.controller.js',
  'modules/sponsors/sponsors.routes.js',
  'modules/sponsors/sponsors.controller.js',
  'modules/roles/roles.routes.js',
  'modules/roles/roles.controller.js',
  'modules/handover/handover.routes.js',
  'modules/handover/handover.controller.js',
  'modules/admin/admin.routes.js',
  'modules/admin/admin.controller.js'
];

files.forEach(f => {
  const fullPath = path.join(srcDir, f);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  if (!fs.existsSync(fullPath)) {
    let content = '// TODO: Implement ' + f + '\n';
    if (f.endsWith('.routes.js')) {
      content = `const express = require('express');\nconst router = express.Router();\n\nmodule.exports = router;`;
    }
    fs.writeFileSync(fullPath, content);
  }
});

const seedFile = path.join(prismaDir, 'seed.js');
if (!fs.existsSync(seedFile)) fs.writeFileSync(seedFile, `const { PrismaClient } = require('@prisma/client');\nconst prisma = new PrismaClient();\n\nasync function main() {\n  // TODO: Add seed logic\n}\n\nmain().catch(console.error).finally(() => prisma.$disconnect());`);

console.log('Scaffolding complete.');
