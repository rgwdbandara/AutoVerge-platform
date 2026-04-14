exports.calculateEMI = (req, res) => {
  try {
    const { price, interestRate, duration } = req.body;

    if (!price || !interestRate || !duration) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const P = Number(price);
    const r = Number(interestRate) / 12 / 100;
    const n = Number(duration);

    const emi =
      (P * r * Math.pow(1 + r, n)) /
      (Math.pow(1 + r, n) - 1);

    return res.json({
      emi: Math.round(emi),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "EMI calculation failed" });
  }
};