const express = require('express');
const mainRouter = express.Router();
const usersRouter = require('./users');
const notesRouter = require('./notes');

// load routes
mainRouter.use('/note', notesRouter);
mainRouter.use('/user', usersRouter);

module.exports = mainRouter;