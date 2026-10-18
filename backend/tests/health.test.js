
import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../app.js";

test("GET /api/health returns a healthy response", async () => {
  const response = await request(app).get("/api/health");

  assert.equal(response.status, 200);
  assert.equal(response.body.status, "ok");
  assert.equal(
    response.body.message,
    "API Monitoring System backend is running"
  );
  assert.ok(response.body.timestamp);
});


test("GET / returns the backend welcome message", async () => {
  const response = await request(app).get("/");

  assert.equal(response.status, 200);
  assert.equal(
    response.body.message,
    "API Monitoring System Backend is running!"
  );
});


test("GET /unknown-route returns 404", async () => {
  const response = await request(app).get("/unknown-route");

  assert.equal(response.status, 404);
  assert.equal(
    response.body.message,
    "Route not found: GET /unknown-route"
  );
});


test("POST with malformed JSON returns 400", async () => {
  const response = await request(app)
    .post("/api/auth/register")
    .set("Content-Type", "application/json")
    .send('{"name":');

  assert.equal(response.status, 400);
});


test("POST /api/auth/register rejects an invalid email", async () => {
  const response = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Test User",
      email: "not-an-email",
      password: "TestPassword123!",
    });

  assert.equal(response.status, 400);
});


test("POST /api/auth/register rejects missing fields", async () => {
  const response = await request(app)
    .post("/api/auth/register")
    .send({
      name: "Test User",
    });

  assert.equal(response.status, 400);
});


test("GET /api/monitors rejects unauthenticated users", async () => {
  const response = await request(app).get("/api/monitors");

  assert.equal(response.status, 401);
});
