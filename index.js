const dotenv = require("dotenv");
const csurf = require("csurf");
const express = require("express");
const session = require("express-session");
const mongodbStore = require("connect-mongo")(session);

const connectDB = require("./db.js");

dotenv.config();

const app = express();

connectDB();

app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    /**
     * You could actually store your secret in your .env file -
     * but to keep this example as simple as possible.
     */
    secret: "supersecret difficult to guess string",
    resave: false,
    saveUninitialized: false,
    store: new mongodbStore({
      url: process.env.MONGO_DB_URI,
      collection: "user_sessions",
    }),
  })
);

app.use(csurf());

app.listen(process.env.SERVER_PORT || 3000);

app.get("/", (req, res) => {
  let name = "Guest";

  if (req.session.user) {
    name = req.session.user;
  }

  res.send(`
    <h1>Welcome, ${name}</h1>
    
    <form action="/choose-name" method="POST">
      <input type="text" name="name" placeholder="Your Name" autocomplete="off">
      <input type="hidden" name="_csrf" value="${req.csrfToken()}">
      <button>Submit</button>
    </form>
    
    <form action="/logout" method="POST">
      <input type="hidden" name="_csrf" value="${req.csrfToken()}">
      <button>Logout</button>
    </form>
  `);
});

app.post("/choose-name", (req, res) => {
  req.session.user = req.body.name.trim();

  res.send(`<p>Thank You.</p> <a href="/">Back Home</a>`);
});

app.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    res.redirect("/");
  });
});
