const { calculateEMI } = require("../../src/controllers/emiController");

describe("EMI API", () => {
  test("should calculate EMI correctly", () => {
    const req = {
      body: {
        price: 12000000,
        interestRate: 12,
        duration: 60,
      },
    };

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    calculateEMI(req, res);

    expect(res.json).toHaveBeenCalledWith({
      emi: expect.any(Number),
    });
  });
});
