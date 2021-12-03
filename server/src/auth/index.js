const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'You need to login 🔐',
  });
});

module.exports = router;
