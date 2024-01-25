const express = require('express');

const router = express.Router();

const frontendRouter = require('./routes/frontendRoutes');

router.use(frontendRouter);


module.exports = router;