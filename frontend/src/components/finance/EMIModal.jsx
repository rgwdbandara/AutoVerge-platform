import { useEffect, useMemo, useState } from "react";

function EMIModal({ price = 0, onClose }) {
  const vehiclePrice = Number(price) || 0;
  const [downPayment, setDownPayment] = useState(0);
  const [interest, setInterest] = useState(6.5);
  const [years, setYears] = useState(4);

  const maxDownPayment = vehiclePrice > 0 ? vehiclePrice : 0;
  const loanAmount = Math.max(vehiclePrice - downPayment, 0);
  const months = years * 12;
  const downPaymentPercent =
    vehiclePrice > 0 ? ((downPayment / vehiclePrice) * 100).toFixed(1) : "0.0";

  const formatNumber = useMemo(
    () =>
      new Intl.NumberFormat("en-LK", {
        maximumFractionDigits: 2,
      }),
    []
  );

  const { emi, totalPayment, totalInterest } = useMemo(() => {
    if (loanAmount <= 0 || months <= 0 || interest < 0) {
      return { emi: 0, totalPayment: 0, totalInterest: 0 };
    }

    const monthlyRate = interest / 100 / 12;
    const monthlyEmi =
      monthlyRate === 0
        ? loanAmount / months
        : (loanAmount * monthlyRate * (1 + monthlyRate) ** months) /
          ((1 + monthlyRate) ** months - 1);

    const total = monthlyEmi * months;
    const interestOnly = Math.max(total - loanAmount, 0);

    return {
      emi: Number.isFinite(monthlyEmi) ? monthlyEmi : 0,
      totalPayment: Number.isFinite(total) ? total : 0,
      totalInterest: Number.isFinite(interestOnly) ? interestOnly : 0,
    };
  }, [interest, loanAmount, months]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div className="relative w-full max-w-[640px] max-h-[90vh] overflow-y-auto rounded-2xl bg-gray-100 p-6 shadow-2xl animate-[fadeIn_0.3s_ease]">
        <button
          onClick={onClose}
          className="absolute text-xl text-gray-500 top-4 right-4 hover:text-gray-800"
        >
          ✕
        </button>

        <h2 className="mb-6 text-[34px] leading-tight font-bold text-gray-900">
          Vehicle Car Loan Calculator
        </h2>

        <div className="space-y-7">
          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
            <label className="block mb-3 text-lg font-semibold text-gray-800">
              Vehicle Price
            </label>
            <div className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg">
              <span className="text-gray-500">LKR</span>
              <input
                type="number"
                value={vehiclePrice}
                readOnly
                className="w-full text-2xl font-semibold text-gray-900 bg-transparent outline-none"
              />
            </div>
            <input
              type="range"
              min="1000"
              max="50000000"
              step="1000"
              value={vehiclePrice}
              disabled
              className="w-full mt-4 cursor-not-allowed accent-blue-600 opacity-70"
            />
          </div>

          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
            <label className="block mb-3 text-lg font-semibold text-gray-800">
              Down Payment
            </label>
            <div className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg">
              <span className="text-gray-500">LKR</span>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => {
                  const value = Math.max(Number(e.target.value) || 0, 0);
                  setDownPayment(value > maxDownPayment ? maxDownPayment : value);
                }}
                className="w-full text-2xl font-semibold text-gray-900 bg-transparent outline-none"
              />
            </div>
            <input
              type="range"
              min="0"
              max={maxDownPayment}
              step="100"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full mt-4 accent-blue-600"
            />
            <p className="mt-3 text-sm text-gray-500">
              Down payment: {downPaymentPercent}% of vehicle price
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
              <label className="block mb-3 text-lg font-semibold text-gray-800">
                Interest Rate
              </label>
              <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg">
                <input
                  type="number"
                  min="1"
                  max="30"
                  step="0.1"
                  value={interest}
                  onChange={(e) => setInterest(Math.max(Number(e.target.value) || 0, 0))}
                  className="w-full text-lg font-semibold text-gray-900 outline-none"
                />
                <span className="text-xl text-gray-500">%</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="0.1"
                value={interest}
                onChange={(e) => setInterest(Number(e.target.value))}
                className="w-full mt-4 accent-blue-600"
              />
            </div>

            <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
              <label className="block mb-3 text-lg font-semibold text-gray-800">
                Loan Term
              </label>
              <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg">
                <input
                  type="number"
                  min="1"
                  max="10"
                  step="1"
                  value={years}
                  onChange={(e) => setYears(Math.max(Number(e.target.value) || 1, 1))}
                  className="w-full text-lg font-semibold text-gray-900 outline-none"
                />
                <span className="text-lg text-gray-500">Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full mt-4 accent-blue-600"
              />
            </div>
          </div>

          <div className="p-6 text-center bg-white border border-gray-200 shadow-sm rounded-xl">
            <p className="text-sm text-gray-500">Monthly Payment</p>
            <h3 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
              LKR {formatNumber.format(emi)}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-2">
            <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
              <p className="text-sm text-gray-500">Vehicle Price</p>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                LKR {formatNumber.format(vehiclePrice)}
              </p>
            </div>

            <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
              <p className="text-sm text-gray-500">Down Payment</p>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                LKR {formatNumber.format(downPayment)}
              </p>
            </div>

            <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
              <p className="text-sm text-gray-500">Loan Amount</p>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                LKR {formatNumber.format(loanAmount)}
              </p>
            </div>

            <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
              <p className="text-sm text-gray-500">Total Interest</p>
              <p className="mt-1 text-xl font-semibold text-gray-900">
                LKR {formatNumber.format(totalInterest)}
              </p>
            </div>
          </div>

          <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-xl">
            <p className="text-sm text-gray-500">
              Total Amount (Down Payment + Total Payments)
            </p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              LKR {formatNumber.format(downPayment + totalPayment)}
            </p>
          </div>

          <p className="mt-4 text-sm text-center text-gray-500">
            This is an estimate. Actual EMI may vary based on your credit score and lender terms.
          </p>
        </div>
      </div>
    </div>
  );
}

export default EMIModal;
