/* eslint-disable no-undef */
const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path =require("path");
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.json());

//setting ejs
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,'public')));
app.get("/", async (request, response) => {
  const Overdue = await Todo.getOverdueTodos();
  const dueToday= await Todo.getdueTodayTodos();
  const dueLater= await Todo.getdueLaterTodos();
  if (request.accepts("html")) {
    response.render('index', {
      Overdue,
      dueToday,
      dueLater
    });
  } else {
    response.json({
      Overdue,
      dueToday,
      dueLater
    });
  }
});
app.get("/todos", async function (_request, response) {
  console.log("Processing list of all Todos ...");
  try{
    const todos =await Todo.findAll();
    return response.send(todos);
  }catch(error){
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
    await Todo.addTodo(request.body.title,request.body.dueDate);
    return response.redirect('/');
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
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
  // FILL IN YOUR CODE HERE
  if (await Todo.findByPk(request.params.id)) {
    await Todo.destroy({
      where: {
        id: request.params.id,
      },
    });
    response.send(true);
  } else {
    response.send(false);
  }
});

module.exports = app;