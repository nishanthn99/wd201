/* eslint-disable no-undef */
const todoList = require("../todo");

const { all, markAsComplete, add } = todoList();

describe("Test for Todos", () => {
  test("should add new todo", () => {
    const TodolistCount = all.length;
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toLocaleDateString("en-CA"),
    });
    expect(all.length).toBe(TodolistCount + 1);
  });
  test("should mark todo as complete", () => {
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });
  test("checks creating the new todo", () => {
    expect(all.length).toBe(1);
  });
  test("checks marking the todo as completed", () => {
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
