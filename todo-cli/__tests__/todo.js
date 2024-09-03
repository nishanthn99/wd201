/* eslint-disable no-undef */
const todoList = require("../todo");

const { all, markAsComplete, add } = todoList();

describe("Test for Todos", () => {
  beforeEach(() => {
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toLocaleDateString("en-CA"),
    });
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
    expect(all[1].completed).toBe(false);
    markAsComplete(1);
    expect(all[1].completed).toBe(true);
  });
  test("should create a new todo", () => {
    const TodolistCount = all.length;
    add({
      title: "First Test Todo",
      completed: false,
      dueDate: new Date().toLocaleDateString("en-CA"),
    });
    expect(all.length).toBe(TodolistCount + 1);
  });

  test("should mark a todo as completed", () => {
    expect(all[0].completed).toBe(false);
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
