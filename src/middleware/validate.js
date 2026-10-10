const validate = (schemas) => (req, res, next) => {
  try {
    if (schemas && typeof schemas.parse === 'function') {
      req.body = schemas.parse(req.body);
      return next();
    }

    if (schemas?.body) {
      req.body = schemas.body.parse(req.body);
    }
    if (schemas?.query) {
      req.query = schemas.query.parse(req.query);
    }
    if (schemas?.params) {
      req.params = schemas.params.parse(req.params);
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { validate };
