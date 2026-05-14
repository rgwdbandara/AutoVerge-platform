import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

function EMIModal({ price = 0, onClose }) {
  const vehiclePrice = Number(price) || 0;
  const [downPayment, setDownPayment] = useState(Math.round(vehiclePrice * 0.05));
  const [interest, setInterest] = useState(15.6);
  const [years, setYears] = useState(1);
  const [plan, setPlan] = useState("pcp");
  const [calculated, setCalculated] = useState(true);

  const maxDownPayment = Math.max(vehiclePrice, 0);
  const loanAmount = Math.max(vehiclePrice - Math.max(downPayment, 0), 0);
  const months = years * 12;

  const formatNumber = useMemo(
    () =>
      new Intl.NumberFormat("en-LK", {
        maximumFractionDigits: 2,
      }),
    []
  );

  const { emi } = useMemo(() => {
    if (loanAmount <= 0 || months <= 0 || interest < 0) {
      return { emi: 0 };
    }

    const monthlyRate = interest / 100 / 12;
    let monthlyEmi =
      monthlyRate === 0
        ? loanAmount / months
        : (loanAmount * monthlyRate * (1 + monthlyRate) ** months) /
          ((1 + monthlyRate) ** months - 1);

    if (plan === "pcp") {
      monthlyEmi *= 0.82;
    }

    return {
      emi: Number.isFinite(monthlyEmi) ? monthlyEmi : 0,
    };
  }, [interest, loanAmount, months, plan]);

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

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div className="relative w-full max-w-[540px] max-h-[88vh] overflow-y-auto rounded-2xl bg-slate-100 p-6 shadow-2xl animate-[fadeIn_0.3s_ease]">
        <button
          onClick={onClose}
          className="absolute text-3xl leading-none text-slate-500 top-3 right-4 hover:text-slate-800"
        >
          ✕
        </button>

        <h2 className="mb-4 text-2xl md:text-3xl leading-tight font-bold text-slate-900">
          Payment calculator
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">Indicative price</label>
              <div className="flex items-center px-3 py-3 bg-slate-200 rounded-xl">
              <input
                type="number"
                value={vehiclePrice}
                readOnly
                  className="w-full text-[18px] font-semibold text-slate-900 bg-transparent outline-none"
              />
                <span className="text-[16px] text-slate-500">LKR</span>
            </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">Down payment</label>
              <div className="flex items-center px-3 py-3 bg-slate-200 rounded-xl">
              <input
                type="number"
                value={downPayment}
                onChange={(e) => {
                  const value = Math.max(Number(e.target.value) || 0, 0);
                  setDownPayment(value > maxDownPayment ? maxDownPayment : value);
                }}
                  className="w-full text-[18px] font-semibold text-slate-900 bg-transparent outline-none"
              />
                <span className="text-[16px] text-slate-500">LKR</span>
            </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">Loan amount</label>
              <div className="flex items-center px-3 py-3 bg-slate-200 rounded-xl">
                <input
                  type="number"
                  value={loanAmount}
                  readOnly
                  className="w-full text-[18px] font-semibold text-slate-900 bg-transparent outline-none"
                />
                <span className="text-[16px] text-slate-500">LKR</span>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-slate-700">Loan term</label>
              <div className="flex items-center px-3 py-3 bg-slate-200 rounded-xl">
                <select
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full bg-transparent text-[18px] font-semibold text-slate-900 outline-none"
                >
                  <option value={1}>1 year</option>
                  <option value={2}>2 years</option>
                  <option value={3}>3 years</option>
                  <option value={4}>4 years</option>
                  <option value={5}>5 years</option>
                </select>
              </div>
            </div>
          </div>

          <div className="max-w-[280px]">
            <label className="block mb-2 text-sm font-medium text-slate-700">Interest rate</label>
            <div className="flex items-center px-3 py-3 bg-slate-200 rounded-xl">
              <input
                type="number"
                min="1"
                max="30"
                step="0.1"
                value={interest}
                onChange={(e) => setInterest(Math.max(Number(e.target.value) || 0, 0))}
                className="w-full text-[18px] font-semibold text-slate-900 bg-transparent outline-none"
              />
              <span className="text-[16px] text-slate-500">% p.a</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-800">Financing plan</h3>

            <div className="mt-3 flex rounded-full bg-slate-200 p-1">
              <button
                type="button"
                onClick={() => setPlan("pcp")}
                className={`flex-1 rounded-full px-4 py-2 text-[16px] font-medium transition ${
                  plan === "pcp" ? "bg-yellow-400 text-slate-900" : "text-slate-700"
                }`}
              >
                PCP
              </button>
              <button
                type="button"
                onClick={() => setPlan("conventional")}
                className={`flex-1 rounded-full px-4 py-2 text-[16px] font-medium transition ${
                  plan === "conventional" ? "bg-yellow-400 text-slate-900" : "text-slate-700"
                }`}
              >
                Conventional
              </button>
            </div>

            <p className="mt-3 text-[16px] leading-7 text-slate-600">
              {plan === "pcp"
                ? "PCP (Personal Contract Plan) - Make low monthly payments, then choose to return the car, pay to own it, or upgrade to a new one."
                : "Conventional plan - Fixed monthly payments until full ownership at the end of the loan term."}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setCalculated(true)}
              className="rounded-lg bg-emerald-500 px-5 py-2 text-[15px] font-semibold text-white transition hover:bg-emerald-600"
            >
              Calculate payment
            </button>

            <div className="text-left">
              <p className="text-sm text-slate-600">Instalments</p>
              <p className="text-3xl md:text-4xl font-bold text-slate-900">
                LKR {formatNumber.format(calculated ? emi : 0)}
                <span className="ml-2 text-sm font-medium text-slate-500">/ Per month</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  // Slightly adjust layout/typography to match screenshot: compact title, padding and action row
  return createPortal(modalContent, document.body);
}

export default EMIModal;
