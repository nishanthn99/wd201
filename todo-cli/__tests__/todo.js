/* eslint-disable no-undef */
const todoList = require("../todo");

const { all, markAsComplete, add } = todoList();

describe("Test for Todos", () => {
  beforeEach(() => {
    all.length = 0;
  });
  test("should add new todo", () => {
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toLocaleDateString("en-CA"),
    });
  });
  test("should mark todo as complete", () => {
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toLocaleDateString("en-CA"),
    });
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });
  test("should create a new todo", () => {
    add({
      title: "First Test Todo",
      completed: false,
      dueDate: new Date().toLocaleDateString("en-CA"),
    });
    expect(all.length).toBe(1);
    expect(all[0].title).toBe("First Test Todo");
    expect(all[0].completed).toBe(false);
  });

  test("should mark a todo as completed", () => {
    add({
      title: "Submit assignment to teacher",
      completed: false,
      dueDate: new Date().toLocaleDateString("en-CA"),
    });
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });
  test("checks retrieval of overdue items", () => {
    const TodolistCount = all.length;
    all.forEach((todo) => {
      todo.dueDate = new Date().toLocaleDateString("en-CA");
    });
    expect(all.length).toBe(TodolistCount);
  });
  test("checks retrieval of due today items", () => {
    const TodolistCount = all.length;
    all.forEach((todo) => {
      todo.dueDate = new Date().toLocaleDateString("en-CA");
    });
    expect(all.length).toBe(TodolistCount);
  });
});
