const request = require("supertest");
const express = require("express");

const app = express();

app.use(express.json());

app.post("/api/vehicles", (req, res) => {
  res.status(201).json({
    success: true,
    vehicle: req.body,
  });
});

describe("CREATE Vehicle API", () => {
  test("should create new vehicle", async () => {
    const newVehicle = {
      brand: "BMW",
      model: "X5",
      price: 25000000,
    };

    const res = await request(app)
      .post("/api/vehicles")
      .send(newVehicle);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.vehicle.brand).toBe("BMW");
  });
});