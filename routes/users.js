const express = require('express');
const { append } = require('express/lib/response');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const users = require('../controllers/users');


router.route('/login')
    .get(users.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (users.loginUser))

router.route('/register')
    .get(users.renderRegisterForm)
    .post(users.registerUser)

router.get('/logout', (users.logout));


module.exports = router