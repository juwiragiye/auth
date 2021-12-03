/* eslint-disable newline-per-chained-call */
const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

const db = require('../db/connection');

const router = express.Router();

const capitalize = (str, lower = false) =>
  (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, (match) =>
    match.toUpperCase()
  );

const users = db.get('users');
users.createIndex('username');

const schema = Joi.object().keys({
  firstname: Joi.string().alphanum().min(1).max(30).required().trim(),
  lastname: Joi.string().alphanum().min(1).max(30).required().trim(),
  username: Joi.string()
    .min(2)
    .max(30)
    .required()
    .regex(/(^[a-zA-Z0-9_]+$)/),
  password: Joi.string().min(8).required().trim(),
});

router.get('/', (req, res) => {
  res.json({
    message: 'You need to login 🔐',
  });
});

router.post('/signup', async (req, res, next) => {
  const result = schema.validate(req.body);
  if (result.error) {
    next(result.error);
  }
  try {
    const user = await users.findOne({ username: req.body.username });

    if (user) {
      // The user with the username given exists
      const error = new Error(
        'The user with chosen username already exists! Pleace choose another one.'
      );
      next(error);
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const newUser = {
      firstname: capitalize(req.body.firstname).trim(),
      lastname: capitalize(req.body.lastname).trim(),
      username: req.body.username.toLowerCase().trim(),
      password: hashedPassword,
    };

    const insertedUser = await users.insert(newUser);

    res.json({
      user: insertedUser,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
