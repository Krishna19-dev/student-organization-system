const { AppError } = require('../lib/errors');
const { ZodError } = require('zod');

const errorHandler = (err, req, res, next) => {
  // If headers already sent, delegate to Express default handler
  if (res.headersSent) {
    return next(err);
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details || {},
      },
    });
  }

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    const formatted = {};
    for (const issue of err.issues) {
      const field = issue.path.join('.') || 'root';
      formatted[field] = issue.message;
    }
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input payload',
        details: formatted,
      },
    });
  }

  // Handle Prisma Known Request Errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: {
        code: 'DUPLICATE',
        message: 'A unique constraint violation occurred',
        details: { target: err.meta?.target },
      },
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      error: {
        code: 'NOT_FOUND',
        message: err.message || 'Record not found',
        details: {},
      },
    });
  }

  console.error('[UNHANDLED ERROR]', err);
  const status = err.status || 500;
  return res.status(status).json({
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: err.message || 'An unexpected error occurred',
      details: {},
    },
  });
};

const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`,
      details: {},
    },
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
