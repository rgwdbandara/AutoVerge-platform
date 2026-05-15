const request = require("supertest");
const express = require("express");

const app = express();

app.delete("/api/vehicles/:id", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Vehicle deleted successfully",
  });
});

describe("DELETE Vehicle API", () => {
  test("should delete vehicle", async () => {
    const res = await request(app)
      .delete("/api/vehicles/1");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Vehicle deleted successfully");
  });
});
