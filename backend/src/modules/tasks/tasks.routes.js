const express = require('express');
const router = express.Router();
const tasksController = require('./tasks.controller');
const { requireAuth } = require('../../middleware/auth');
const { requireRole } = require('../../middleware/roles');

router.use(requireAuth);

// Fundraisers
router.post(
  '/fundraisers',
  requireRole('PRESIDENT'),
  tasksController.createFundraiser
);
router.get(
  '/fundraisers/:id',
  requireRole('VOLUNTEER', 'TREASURER', 'PRESIDENT'),
  tasksController.getFundraiser
);
router.post(
  '/fundraisers/:id/takings',
  requireRole('TREASURER', 'PRESIDENT'),
  tasksController.recordTakings
);

// If mounted at /api/fundraisers directly:
router.post(
  '/',
  requireRole('PRESIDENT'),
  (req, res, next) => {
    if (req.baseUrl.includes('fundraisers')) {
      return tasksController.createFundraiser(req, res, next);
    }
    return tasksController.createTask(req, res, next);
  }
);
router.get(
  '/:id',
  requireRole('VOLUNTEER', 'TREASURER', 'PRESIDENT'),
  (req, res, next) => {
    if (req.baseUrl.includes('fundraisers')) {
      return tasksController.getFundraiser(req, res, next);
    }
    next();
  }
);
router.post(
  '/:id/takings',
  requireRole('TREASURER', 'PRESIDENT'),
  tasksController.recordTakings
);

// Tasks
router.post(
  '/tasks',
  requireRole('PRESIDENT'),
  tasksController.createTask
);
router.get(
  '/tasks/mine',
  requireRole('VOLUNTEER', 'TREASURER', 'PRESIDENT'),
  tasksController.myTasks
);
router.get(
  '/mine',
  requireRole('VOLUNTEER', 'TREASURER', 'PRESIDENT'),
  tasksController.myTasks
);
router.get(
  '/tasks',
  requireRole('TREASURER', 'PRESIDENT'),
  tasksController.listTasks
);
router.patch(
  '/tasks/:id/status',
  requireRole('VOLUNTEER', 'PRESIDENT'),
  tasksController.updateTaskStatus
);
router.patch(
  '/:id/status',
  requireRole('VOLUNTEER', 'PRESIDENT'),
  tasksController.updateTaskStatus
);

module.exports = router;