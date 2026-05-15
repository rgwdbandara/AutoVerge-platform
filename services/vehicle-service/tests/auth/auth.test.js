const request = require("supertest");
const express = require("express");

const app = express();

app.use(express.json());

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email === "test@gmail.com" &&
    password === "123456"
  ) {
    return res.status(200).json({
      success: true,
      token: "sample-jwt-token",
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid credentials",
  });
});

describe("AUTH API", () => {

  test("should login successfully", async () => {

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@gmail.com",
        password: "123456",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

  });

  test("should fail invalid login", async () => {

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "wrong@gmail.com",
        password: "wrongpass",
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);

  });

});
