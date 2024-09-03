/* eslint-disable no-undef */
const todoList = require("../todo");

const { all, markAsComplete, add, overdue, dueToday } = todoList();

describe("Test for Todos", () => {
  beforeEach(() => {
    all.length = 0;
  });
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
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toLocaleDateString("en-CA"),
    });
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });
  test("should create a new todo", () => {
    const TodolistCount = all.length;
    add({
      title: "First Test Todo",
      complete: false,
      dueDate: new Date().toLocaleDateString("en-CA"),
    });
    expect(all.length).toBe(TodolistCount + 1);
  });

  test("should mark a todo as completed", () => {
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toLocaleDateString("en-CA"),
    });
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });
  test("checks retrieval of overdue items", () => {
    add({
      title: "Pay money to friend",
      complete: false,
      dueDate: new Date(Date.now() - 86400000).toISOString().slice(0, 10), // 1 day in the past
    });
    add({
      title: "Meeting with friends",
      complete: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    const overdueItems = overdue();
    expect(overdueItems.length).toBe(1);
    expect(overdueItems[0].title).toBe("Pay money to friend");
  });
  test("checks retrieval of due today items", () => {
    add({
      title: "eating out with friends",
      complete: false,
      dueDate: new Date().toLocaleDateString("en-CA"),
    });
    const dueTodayItems = dueToday();
    expect(dueTodayItems.length).toBe(1);
    expect(dueTodayItems[0].title).toBe("eating out with friends");
  });
});
