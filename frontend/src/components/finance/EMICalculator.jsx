import { useState } from "react";
import axios from "axios";

function EMICalculator({ price }) {
  const [interest, setInterest] = useState(10);
  const [duration, setDuration] = useState(60);
  const [emi, setEmi] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateEMI = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/vehicles/calculate-emi",
        {
          price,
          interestRate: interest,
          duration,
        }
      );

      setEmi(res.data.emi);
    } catch (error) {
      console.error("EMI error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 mt-6 bg-white border shadow-sm rounded-2xl">
      <h2 className="mb-3 text-lg font-semibold">EMI Calculator</h2>

      <div className="grid grid-cols-2 gap-3">
        <input
          type="number"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          placeholder="Interest (%)"
          className="p-2 border rounded-lg"
        />

        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Months"
          className="p-2 border rounded-lg"
        />
      </div>

      <button
        onClick={calculateEMI}
        className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-lg"
      >
        {loading ? "Calculating..." : "Calculate EMI"}
      </button>

      {emi && (
        <p className="mt-4 text-gray-700">
          Estimated Monthly Payment:{" "}
          <span className="font-bold text-black">LKR {emi}</span>
        </p>
      )}
    </div>
  );
}

export default EMICalculator;