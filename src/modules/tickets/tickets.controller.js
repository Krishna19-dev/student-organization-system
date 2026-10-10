const ticketService = require('../../services/ticket.service');
const paymentService = require('../../services/payment.service');
const { toDataUrl } = require('../../lib/qr');
const { badRequest } = require('../../lib/errors');
const asyncHandler = require('../../lib/asyncHandler');

exports.verifyTicketPayment = asyncHandler(async (req, res) => {
  const { gatewayOrderId, gatewayPaymentId, signature } = req.body;
  if (!gatewayOrderId) {
    throw badRequest('ORDER_ID_REQUIRED', 'Gateway order ID is required');
  }

  const result = await paymentService.confirmPayment({
    gatewayOrderId,
    gatewayPaymentId: gatewayPaymentId || `pay_${Date.now()}`,
    signature: signature || 'mock_signature',
    actorId: req.user?.id,
  });

  const tickets = result.tickets || [];
  const ticketsWithQr = await Promise.all(
    tickets.map(async (t) => ({
      ...t,
      qrDataUrl: await toDataUrl(t.qrToken),
    }))
  );

  res.json({
    message: 'Payment verified and tickets issued',
    tickets: ticketsWithQr,
    ...result,
  });
});

exports.myTickets = asyncHandler(async (req, res) => {
  const tickets = await ticketService.getMyTickets(req.user.id);
  res.json(tickets);
});

exports.checkIn = asyncHandler(async (req, res) => {
  const { qrToken } = req.body;
  const result = await ticketService.checkInTicket(qrToken);
  res.json(result);
});
