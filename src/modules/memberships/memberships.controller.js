const membershipService = require('../../services/membership.service');
const asyncHandler = require('../../lib/asyncHandler');

exports.myCard = asyncHandler(async (req, res) => {
  const card = await membershipService.getMyCard(req.user.id);
  res.json(card);
});

exports.verifyMember = asyncHandler(async (req, res) => {
  const { qrToken } = req.params;
  const result = await membershipService.verifyMemberByToken(qrToken);
  res.json(result);
});
