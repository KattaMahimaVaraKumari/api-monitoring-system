
import { test } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../app.js";

import Monitor from "../src/models/Monitor.js";
import { getMonitor } from "../src/controllers/monitorController.js";
import { updateProfile } from "../src/controllers/authController.js";
import { updateProfileSchema } from "../src/utils/validationSchemas.js";

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


test("PUT /api/auth/profile rejects unauthenticated users", async () => {
  const response = await request(app)
    .put("/api/auth/profile")
    .send({ name: "Updated Name" });

  assert.equal(response.status, 401);
});


test("profile name validation trims whitespace and rejects empty names", () => {
  assert.deepEqual(
    updateProfileSchema.parse({ name: "  Updated Name  " }),
    { name: "Updated Name" }
  );
  assert.equal(updateProfileSchema.safeParse({ name: "   " }).success, false);
});


test("updateProfile saves and returns the authenticated user's updated name", async () => {
  const user = {
    _id: "507f1f77bcf86cd799439011",
    name: "Original Name",
    email: "user@example.com",
    role: "user",
    async save() {},
  };
  let statusCode = 200;
  let body;
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      body = data;
      return this;
    },
  };

  await updateProfile({ user, body: { name: "Updated Name" } }, res);

  assert.equal(user.name, "Updated Name");
  assert.equal(statusCode, 200);
  assert.deepEqual(body.user, {
    id: user._id,
    name: "Updated Name",
    email: "user@example.com",
    role: "user",
  });
});


test("POST /api/auth/login rejects missing fields", async () => {
  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email: "test@example.com",
    });

  assert.equal(response.status, 400);
});


test("POST /api/auth/login rejects an invalid email", async () => {
  const response = await request(app)
    .post("/api/auth/login")
    .send({
      email: "invalid-email",
      password: "TestPassword123!",
    });

  assert.equal(response.status, 400);
});


test("getMonitor returns 404 when the monitor does not exist", async (t) => {
  t.mock.method(Monitor, "findOne", async () => null);

  const req = {
    params: { id: "507f1f77bcf86cd799439011" },
    user: { _id: "507f1f77bcf86cd799439012" },
  };

  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
  };

  await getMonitor(req, res);

  assert.equal(res.statusCode, 404);
  assert.deepEqual(res.body, {
    message: "Monitor not found",
  });
});