/* eslint-disable no-undef */
const request = require("supertest");
const db = require("../models/index");
const app = require("../app");
const cheerio=require('cheerio');
let server, agent;

function extractCSRF(res){
  var $=cheerio.load(res.text);
  return $('input[name="_csrf"]').attr('value');
}

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

  test("Creates a todo and responds with json at /todos POST endpoint", async () => {
    const res=await agent.get('/');
    const csrfToken=extractCSRF(res); 
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      "_csrf":csrfToken
    });
    expect(response.statusCode).toBe(302);
    // expect(response.header["content-type"]).toBe(
    //   "application/json; charset=utf-8",
    // );
    // const parsedResponse = JSON.parse(response.text);
    // expect(parsedResponse.id).toBeDefined();
  });
  test("Updates a todo and responds with json at /todos PUT endpoint", async () => {
    const res=await agent.get('/');
    const csrfToken=extractCSRF(res); 
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      "_csrf":csrfToken
    });
    expect(response.statusCode).toBe(302);
    const markComplete=await agent.put(`/todos/2`);
    console.log(markComplete);
    expect(markComplete.completed).toBe(true);
    const markComplete1=await agent.put(`/todos/2`);
    expect(markComplete1.completed).toBe(false);
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
    const res=await agent.get('/');
    const csrfToken=extractCSRF(res);
    const response=await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      "_csrf":csrfToken
    });
    expect(response.statusCode).toBe(302);
    const deleteResponse = await agent.delete(`/todos/3`);
    const parsedDeleteResponse = JSON.parse(deleteResponse.text);
    expect(parsedDeleteResponse).toBe(true);
    const deleteResponse1 = await agent.delete(`/todos/3`);
    const parsedDeleteResponse1 = JSON.parse(deleteResponse1.text);
    expect(parsedDeleteResponse1).toBe(false);
  });
 });
