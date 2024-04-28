const express = require('express');
const usersRouter = express.Router();
import { registerUser, loginUser } from '../../controllers/usersController';

usersRouter
    .post('/register', registerUser)
    .post('/login', loginUser);

module.exports = usersRouter;