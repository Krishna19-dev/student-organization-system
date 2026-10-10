const electionService = require('../../services/election.service');
const asyncHandler = require('../../lib/asyncHandler');

exports.electOfficer = asyncHandler(async (req, res) => {
  const result = await electionService.electOfficer(req.user.id, req.body);
  res.json({ message: 'Officer elected successfully', assignment: result });
});

exports.getRoles = asyncHandler(async (req, res) => {
  const assignments = await electionService.listRoleAssignments();
  res.json(assignments);
});
