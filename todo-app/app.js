/* eslint-disable no-undef */
const express = require("express");
var csrf=require("tiny-csrf");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser")
const path =require("path");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("shh! some secret string"));
app.use(csrf("this_should_be_32_character_long",["POST","PUT","DELETE"]));

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,'public')));
app.get("/", async (request, response) => {
  const Overdue = await Todo.getOverdueTodos();
  const dueToday= await Todo.getdueTodayTodos();
  const dueLater= await Todo.getdueLaterTodos();
  const Completed = await Todo.completedItems();
  if (request.accepts("html")) {
    response.render('index', {
      Overdue,
      dueToday,
      dueLater,
      Completed,
      csrfToken: request.csrfToken(),
    });
  } else {
    response.json({
      Overdue,
      dueToday,
      dueLater,
      Completed
    });
  }
});

app.get("/", function (request, response) {
  response.send("Hello World");
});

app.get("/todos", async function (_request, response) {
  console.log("Processing list of all Todos ...");
  // FILL IN YOUR CODE HERE

  // First, we have to query our PostgerSQL database using Sequelize to get list of all Todos.
  // Then, we have to respond with all Todos, like:
  try{
    const todos =await Todo.findAll();
    return response.send(todos);
  }catch(error){
    console.log(error);
    return response.status(422).json(error);
  }
  // response.send(todos)
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
    await Todo.addTodo(request.body);
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  // FILL IN YOUR CODE HERE
  if (await Todo.findByPk(request.params.id)) {
    await Todo.destroy({
      where: {
        id: request.params.id,
      },
    });
    if (await Todo.findByPk(request.params.id)) {
      response.send(false);
    } else {
      response.send(true);
    }
  } else {
    response.send(false);
  }
  // First, we have to query our database to delete a Todo by ID.
  // Then, we have to respond back with true/false based on whether the Todo was deleted or not.
  // response.send(true)
});

module.exports = app;