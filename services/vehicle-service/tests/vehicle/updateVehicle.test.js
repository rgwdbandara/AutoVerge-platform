const request = require("supertest");
const express = require("express");

const app = express();

app.use(express.json());

app.put("/api/vehicles/:id", (req, res) => {
  res.status(200).json({
    success: true,
    updatedVehicle: {
      id: req.params.id,
      ...req.body,
    },
  });
});

describe("UPDATE Vehicle API", () => {
  test("should update vehicle details", async () => {
    const updatedData = {
      brand: "Toyota",
      model: "Corolla",
      price: 14500000,
    };

    const res = await request(app)
      .put("/api/vehicles/1")
      .send(updatedData);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.updatedVehicle.model).toBe("Corolla");
  });
});