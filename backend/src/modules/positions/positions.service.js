const defaultPrisma = require('../../lib/prisma');

// In-memory / persistent seed for club positions
let POSITIONS_STORE = [
  {
    id: 'pos-tech-lead',
    title: 'Technical Lead',
    department: 'Engineering & Tech',
    description: 'Lead engineering workshops, hackathons, and software architecture for campus platforms.',
    isOpen: true,
    deadline: '2026-11-15T23:59:59.000Z',
    slots: 2,
    requirements: 'Strong proficiency in TypeScript/React, Node.js, and Git teamwork.',
  },
  {
    id: 'pos-web-dev',
    title: 'Web Development Team',
    department: 'Engineering & Tech',
    description: 'Build, maintain, and enhance Club_Hub web portals, event registration pages, and club tools.',
    isOpen: true,
    deadline: '2026-11-20T23:59:59.000Z',
    slots: 5,
    requirements: 'Experience with React, Tailwind CSS, REST APIs, or fullstack development.',
  },
  {
    id: 'pos-app-dev',
    title: 'App Development Team',
    department: 'Engineering & Tech',
    description: 'Develop mobile applications for event check-ins, ticketing QR passes, and student engagement.',
    isOpen: true,
    deadline: '2026-11-20T23:59:59.000Z',
    slots: 3,
    requirements: 'Knowledge of React Native, Flutter, or native mobile development.',
  },
  {
    id: 'pos-design',
    title: 'Design & Creative Team',
    department: 'Media & Design',
    description: 'Design official banners, UI/UX mockups, club merchandise graphics, and promotional flyers.',
    isOpen: true,
    deadline: '2026-11-18T23:59:59.000Z',
    slots: 4,
    requirements: 'Proficiency in Figma, Adobe Illustrator/Photoshop, or Canva design systems.',
  },
  {
    id: 'pos-event-mgmt',
    title: 'Event Management Team',
    department: 'Operations',
    description: 'Plan, coordinate, and run flagship campus hackathons, technical speaker sessions, and cultural fests.',
    isOpen: true,
    deadline: '2026-11-25T23:59:59.000Z',
    slots: 6,
    requirements: 'Strong leadership, crowd management, scheduling, and stage coordination skills.',
  },
  {
    id: 'pos-marketing',
    title: 'Marketing & PR Team',
    department: 'Outreach & Growth',
    description: 'Drive social media campaigns, campus outreach, student engagement, and brand storytelling.',
    isOpen: true,
    deadline: '2026-11-22T23:59:59.000Z',
    slots: 4,
    requirements: 'Social media management, copy writing, community outreach, or content creation.',
  },
  {
    id: 'pos-finance-sponsor',
    title: 'Finance & Sponsorship Lead',
    department: 'Treasury & Corporate',
    description: 'Pitch club initiatives to corporate tech sponsors, manage partner deliverables, and assist in treasury.',
    isOpen: true,
    deadline: '2026-11-10T23:59:59.000Z',
    slots: 2,
    requirements: 'Excellent communication, sponsorship pitching, and spreadsheet budget tracking skills.',
  },
  {
    id: 'pos-content-doc',
    title: 'Content & Documentation Team',
    department: 'Editorial',
    description: 'Write official club announcements, post-event reports, newsletter articles, and annual documentation.',
    isOpen: true,
    deadline: '2026-11-30T23:59:59.000Z',
    slots: 3,
    requirements: 'Clear writing skills, attention to detail, and ability to summarize events effectively.',
  },
  {
    id: 'pos-volunteer',
    title: 'Volunteer Crew',
    department: 'Ground Operations',
    description: 'Support registration desks, QR gate scanning, stage logistics, and audience assistance during live events.',
    isOpen: true,
    deadline: null,
    slots: 15,
    requirements: 'Enthusiastic, proactive team player ready to contribute on campus.',
  },
];

async function listOpenPositions() {
  return POSITIONS_STORE.filter((p) => p.isOpen);
}

async function listAllPositions() {
  return POSITIONS_STORE;
}

async function getPositionById(id) {
  return POSITIONS_STORE.find((p) => p.id === id);
}

async function createPosition(data) {
  const newPos = {
    id: `pos-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    title: data.title,
    department: data.department || 'General',
    description: data.description || '',
    isOpen: data.isOpen !== false,
    deadline: data.deadline || null,
    slots: parseInt(data.slots, 10) || 1,
    requirements: data.requirements || '',
    createdAt: new Date().toISOString(),
  };
  POSITIONS_STORE.unshift(newPos);
  return newPos;
}

async function updatePosition(id, data) {
  const index = POSITIONS_STORE.findIndex((p) => p.id === id);
  if (index === -1) return null;
  POSITIONS_STORE[index] = {
    ...POSITIONS_STORE[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  return POSITIONS_STORE[index];
}

async function togglePositionOpen(id) {
  const pos = POSITIONS_STORE.find((p) => p.id === id);
  if (!pos) return null;
  pos.isOpen = !pos.isOpen;
  pos.updatedAt = new Date().toISOString();
  return pos;
}

async function deletePosition(id) {
  const index = POSITIONS_STORE.findIndex((p) => p.id === id);
  if (index === -1) return false;
  POSITIONS_STORE.splice(index, 1);
  return true;
}

module.exports = {
  listOpenPositions,
  listAllPositions,
  getPositionById,
  createPosition,
  updatePosition,
  togglePositionOpen,
  deletePosition,
};
