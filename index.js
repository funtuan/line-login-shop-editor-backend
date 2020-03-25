const express = require('express');
const cors = require('cors');
const app = express();
const { validate, ValidationError, Joi } = require('express-validation');
require('dotenv').config();

const line_login = require("line-login");
const session = require("express-session");
const session_options = {
    secret: process.env.LINE_LOGIN_CHANNEL_SECRET,
    resave: false,
    saveUninitialized: false
}
app.use(session(session_options));

const login = new line_login({
    channel_id: process.env.LINE_LOGIN_CHANNEL_ID,
    channel_secret: process.env.LINE_LOGIN_CHANNEL_SECRET,
    callback_url: process.env.LINE_LOGIN_CALLBACK_URL,
    scope: "openid profile",
    prompt: "consent",
    bot_prompt: "normal"
});

app.listen(process.env.PORT || 5000, () => {
    console.log(`server is listening to ${process.env.PORT || 5000}...`);
});

// cors全域開放
const corsOptions = {
  origin: [
    'http://localhost:8080',
    'https://funtuan.github.io',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));

// Specify the path you want to start authorization.
app.use("/login", login.auth());

// Specify the path you want to wait for the callback from LINE authorization endpoint.
app.use("/callback", login.callback(
    (req, res, next, token_response) => {
        // Success callback
        req.session.id_token = token_response.id_token;
        // res.json(token_response.id_token);
        res.redirect(process.env.VUE_HOST, 302);
    },
    (req, res, next, error) => {
        // Failure callback
        res.status(400).json(error);
    }
));

const paramValidation = require('./paramValidation.js');
const { loadUserHandler, shopHandler, tagHandler } = require('./apiHandler.js');
app.use(express.json());

app.post('/api/shop', validate(paramValidation.postShop), loadUserHandler, shopHandler.post);
app.put('/api/shop', validate(paramValidation.putShop), loadUserHandler, shopHandler.put);
app.get('/api/shop', loadUserHandler, shopHandler.get);
app.get('/api/shop/:id', loadUserHandler, shopHandler.get);
app.delete('/api/shop/:id', loadUserHandler, shopHandler.delete);

app.post('/api/tag', validate(paramValidation.postTag), loadUserHandler, tagHandler.post);
app.put('/api/tag', validate(paramValidation.putTag), loadUserHandler, tagHandler.put);
app.get('/api/tag', loadUserHandler, tagHandler.get);
app.get('/api/tag/:id', loadUserHandler, tagHandler.get);
app.delete('/api/tag/:id', loadUserHandler, tagHandler.delete);

app.use(function(err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err)
  }
 
  return res.status(500).json(err)
})

app.get('/api/checkLogin', (req, res) => {
  if (req.session.id_token) {
    res.send({
      success: true,
      msg: 'logged',
    });
  } else {
    res.send({
      success: false,
      msg: 'Not logged in',
    });
  }
});