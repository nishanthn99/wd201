/* eslint-disable no-undef */
const request = require("supertest");
const db = require("../models/index");
const app = require("../app");
const cheerio = require("cheerio");
let server, agent;

function extractCSRF(res) {
  const $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}

const login = async (agent, email, password) => {
  let res = await agent.get("/login");
  const csrfToken = extractCSRF(res);
  await agent.post("/session").send({
    email,
    password,
    _csrf: csrfToken,
  });
};

describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(3000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  test("signup", async () => {
    let res = await agent.get("/signup");
    const csrfToken = extractCSRF(res);
    const response = await agent.post("/newuser").send({
      firstname: "test",
      lastname: "case",
      email: "test@gmail.com",
      password: "test123",
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
  });

  test("signout", async function () {
    let res = await agent.get("/todos");
    expect(res.statusCode).toBe(200);
    res = await agent.get("/logout");
    expect(res.statusCode).toBe(302);
    res = await agent.get("/todos");
    expect(res.statusCode).toBe(302);
  });

  test("Creates a todo and responds with json at /todos POST endpoint", async () => {
    const agent = request.agent(server);
    await login(agent, "test@gmail.com", "test123");
    const res = await agent.get("/todos");
    const csrfToken = extractCSRF(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(302);
    // expect(response.header["content-type"]).toBe(
    //   "application/json; charset=utf-8",
    // );
    // const parsedResponse = JSON.parse(response.text);
    // expect(parsedResponse.id).toBeDefined();
  });
  test("Mark a Todo as Complete", async () => {
    const agent = request.agent(server);
    await login(agent, "test@gmail.com", "test123");
    const res = await agent.get("/todos");
    const csrfToken = extractCSRF(res);
    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    const groupedresponse = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedResponse = JSON.parse(groupedresponse.text);
    const dueTodayCount = parsedResponse.dueToday.length;
    const latestTodo = parsedResponse.dueToday[dueTodayCount - 1];

    let res1 = await agent.get("/todos");
    let csrfToken1 = extractCSRF(res1);
    const markAsCompletedResponse = await agent
      .put(`/todos/${latestTodo.id}`)
      .send({
        _csrf: csrfToken1,
        completed: true,
      });
    const parsedUpdateResponse = JSON.parse(markAsCompletedResponse.text);
    expect(parsedUpdateResponse.completed).toBe(true);
  });

  // test("Marks a todo with the given ID as complete", async () => {
  //   const response = await agent.post("/todos").send({
  //     title: "Buy milk",
  //     dueDate: new Date().toISOString(),
  //     completed: false,
  //   });
  //   const parsedResponse = JSON.parse(response.text);
  //   const todoID = parsedResponse.id;

  //   expect(parsedResponse.completed).toBe(false);

  //   const markCompleteResponse = await agent
  //     .put(`/todos/${todoID}/markAsCompleted`)
  //     .send();
  //   const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
  //   expect(parsedUpdateResponse.completed).toBe(true);
  // });

  //   test("Fetches all todos in the database using /todos endpoint", async () => {
  //     await agent.post("/todos").send({
  //       title: "Buy xbox",
  //       dueDate: new Date().toISOString(),
  //       completed: false,
  //     });
  //     await agent.post("/todos").send({
  //       title: "Buy ps3",
  //       dueDate: new Date().toISOString(),
  //       completed: false,
  //     });
  //     const response = await agent.get("/todos");
  //     const parsedResponse = JSON.parse(response.text);

  //     expect(parsedResponse.length).toBe(4);
  //     expect(parsedResponse[3]["title"]).toBe("Buy ps3");
  //   });

  test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
    // FILL IN YOUR CODE HERE
    const agent = request.agent(server);
    await login(agent, "test@gmail.com", "test123");
    const res = await agent.get("/todos");
    const csrfToken = extractCSRF(res);
    await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    const groupedresponse = await agent
      .get("/todos")
      .set("Accept", "application/json");
    const parsedResponse = JSON.parse(groupedresponse.text);
    expect(parsedResponse.dueToday).toBeDefined();

    const dueTodayCount = parsedResponse.dueToday.length;
    const latestTodo = parsedResponse.dueToday[dueTodayCount - 1];

    const res1 = await agent.get("/todos");
    const csrfToken1 = extractCSRF(res1);

    const deleteTodos = await agent.delete(`/todos/${latestTodo.id}`).send({
      _csrf: csrfToken1,
    });
    expect(deleteTodos.statusCode).toBe(200);
  });
});
