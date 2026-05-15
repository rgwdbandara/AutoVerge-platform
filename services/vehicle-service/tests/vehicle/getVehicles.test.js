const request = require("supertest");
const express = require("express");

const app = express();

app.use(express.json());

const vehicles = [
  {
    _id: "1",
    brand: "Toyota",
    model: "Prius",
    price: 12500000,
  },
  {
    _id: "2",
    brand: "Honda",
    model: "Fit",
    price: 9800000,
  },
];

app.get("/api/vehicles", (req, res) => {
  res.status(200).json({
    success: true,
    vehicles,
  });
});

describe("GET Vehicles API", () => {
  test("should return all vehicles", async () => {
    const res = await request(app).get("/api/vehicles");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.vehicles.length).toBe(2);
  });
});