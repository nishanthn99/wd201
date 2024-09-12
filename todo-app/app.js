/* eslint-disable no-undef */
const express = require("express");
const app = express();
const { Todo, User } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");

//csrf attack
const cookieParser = require("cookie-parser");
const csrf = require("tiny-csrf");

//authetications
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const connectEnsureLogin = require("connect-ensure-login");

//password encryption
const bcrypt = require("bcrypt");
const saltRounds = 10;

const flash = require("connect-flash");
app.set("views", path.join(__dirname, "views"));
app.use(flash());

app.use(
  session({
    secret: "nishanth99",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use(function (request, response, next) {
  response.locals.messages = request.flash();
  next();
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({ where: { email: username } })
        .then(async (user) => {
          const compared = await bcrypt.compare(password, user.password);
          if (compared) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Invalide Login Creditials" });
          }
        })
        .catch((err) => {
          return err;
        });
    },
  ),
);

passport.serializeUser((user, done) => {
  console.log(`User Session gets initialized ${user.id}`);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser("Shh! we are using secreat key"));
app.use(csrf("this_should_be_32_character_long", ["PUT", "POST", "DELETE"]));
//setting ejs
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.get(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    const userSessionId = request.user.id;
    const Overdue = await Todo.getOverdueTodos(userSessionId);
    const dueToday = await Todo.getdueTodayTodos(userSessionId);
    const dueLater = await Todo.getdueLaterTodos(userSessionId);
    const completedItems = await Todo.completedItems(userSessionId);
    if (request.accepts("html")) {
      response.render("todos", {
        Overdue,
        dueToday,
        dueLater,
        completedItems,
        _csrf: request.csrfToken(),
      });
    } else {
      response.json({
        Overdue,
        dueToday,
        dueLater,
      });
    }
  },
);

app.get("/signup", (req, res) => {
  res.render("signup", {
    title: "Sign up Here To Create a New Account:",
    _csrf: req.csrfToken(),
  });
});

app.get("/login", (req, res) => {
  res.render("login", {
    title: "Login Here To Access Your Account:",
    _csrf: req.csrfToken(),
  });
});

app.post(
  "/session",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Login successful!");
    res.redirect("/todos");
  },
);

app.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.post("/newuser", async (req, res) => {
  const fname = req.body.firstname;
  const email = req.body.email;
  const password = req.body.password;
  const bcryptPass = await bcrypt.hash(password, saltRounds);
  if (fname.length < 3) {
    req.flash("error", "Please enter a valid first name.");
    return res.redirect("/signup");
  }
  if (email.length < 1) {
    req.flash("error", "Please enter a valid Email name.");
    return res.redirect("/signup");
  }
  if (password.length < 1) {
    req.flash("error", "Please enter a valid password.");
    return res.redirect("/signup");
  }
  try {
    const user = await User.create({
      firstname: fname,
      lastname: req.body.lastname,
      email: email,
      password: bcryptPass,
    });
    req.login(user, (err) => {
      if (err) {
        console.log(err);
      }
      res.redirect("/todos");
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

app.get("/todo", async function (_request, response) {
  console.log("Processing list of all Todos ...");
  try {
    const todos = await Todo.findAll();
    return response.send(todos);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async function (request, response) {
  try {
    if (request.body.title.length < 5) {
      request.flash(
        "error",
        "Please make sure title should be more than 5 letters",
      );
      return response.redirect("/todos");
    }
    if (request.body.dueDate == "") {
      request.flash("error", "Please Enter date");
      return response.redirect("/todos");
    }
    await Todo.addTodo(
      request.body.title,
      request.body.dueDate,
      request.user.id,
    );
    request.flash("success", "Todo created successfully.");
    return response.redirect("/todos");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  if (todo.completed) {
    const updatedTodo = await todo.setCompletionStatus(false);
    request.flash("success", `Todo marked as complete`);
    response.json(updatedTodo);
  } else {
    const updatedTodo = await todo.setCompletionStatus(true);
    response.json(updatedTodo);
  }
});

app.put("/todos/:id/markASCompleted", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});
app.put("/todos/:id/markIncompleted", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsIncompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  const userId = request.user.id;
  // FILL IN YOUR CODE HERE
  try {
    const id = request.params.id;
    await Todo.remove(id, userId);
    request.flash("success", "Todo deleted successfully.");
    return response.status(200).json(true);
  } catch (error) {
    console.log(error);
    return response.status(422).json(false);
  }
});

module.exports = app;
