const request = require("supertest");
const express = require("express");

const app = express();

app.use(express.json());

app.post("/api/vehicles", (req, res) => {
  const { brand, model, price } = req.body;

  if (!brand || !model || !price) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  res.status(201).json({
    success: true,
  });
});

describe("INVALID Vehicle API", () => {
  test("should fail when fields are missing", async () => {
    const res = await request(app)
      .post("/api/vehicles")
      .send({
        brand: "Toyota",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
