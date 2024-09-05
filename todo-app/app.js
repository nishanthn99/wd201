const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");
app.use(bodyParser.json());

// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

//Todo.createTodo({title:"first todo",dueDate:"2024-10-10"});
//Todo.createTodo({title:"sec todo",dueDate:"2023-09-09"});

app.get("/", async function (request, response) {
  const getTodos = await Todo.getTodos();
  if (request.accepts("html")) {
    response.render("index", { getTodos });
  } else {
    response.json(getTodos);
  }
});

app.get("/todos", async function (_request, response) {
  console.log("Processing list of all Todos ...");
  try {
    const TodoItems = await Todo.findAll();
    response.json(TodoItems);
  } catch (error) {
    response.status(455).json(error);
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
    const todo = await Todo.createTodo(request.body);
    return response.json(todo);
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
  const id = request.params.id;
  console.log(`deleting todo for id${id}`);
  try {
    const todo = await Todo.findByPk(id);
    await todo.destroy();
    response.json(true);
  } catch (err) {
    response.status(500).json(false);
    console.log(err);
  }
});

module.exports = app;
