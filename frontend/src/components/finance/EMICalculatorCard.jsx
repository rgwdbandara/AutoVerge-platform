import { useMemo } from "react";

function EMICalculatorCard({
  price = 0,
  downPayment = 0,
  downPaymentPercent = 0,
  interestRate = 4.5,
  loanTerm = 60,
}) {
  const { monthlyPayment, downPaymentAmount, loanAmount, totalInterest, totalPayment } = useMemo(() => {
    const priceValue = Number(price) || 0;
    const downPaymentValue = Number(downPayment) || 0;
    const percent = Number(downPaymentPercent) || 0;
    const rate = Number(interestRate) || 0;
    const months = Number(loanTerm) || 0;

    if (priceValue <= 0 || months <= 0) {
      return {
        monthlyPayment: 0,
        downPayment: 0,
        loanAmount: 0,
        totalInterest: 0,
        totalPayment: 0,
      };
    }

    const fallbackDownPayment = (priceValue * percent) / 100;
    const effectiveDownPayment = downPaymentValue > 0 ? downPaymentValue : fallbackDownPayment;
    const loanValue = Math.max(priceValue - effectiveDownPayment, 0);
    const monthlyRate = rate / 100 / 12;

    let emi = 0;
    if (monthlyRate === 0) {
      emi = loanValue / months;
    } else {
      emi =
        (loanValue * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
    }

    const total = emi * months;
    const interestValue = Math.max(total - loanValue, 0);

    return {
      monthlyPayment: Number.isFinite(emi) ? emi : 0,
      downPaymentAmount: Number.isFinite(effectiveDownPayment) ? effectiveDownPayment : 0,
      loanAmount: Number.isFinite(loanValue) ? loanValue : 0,
      totalInterest: Number.isFinite(interestValue) ? interestValue : 0,
      totalPayment: Number.isFinite(total) ? total : 0,
    };
  }, [price, downPayment, downPaymentPercent, interestRate, loanTerm]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl">
      <div className="flex items-center gap-2">
        <span className="text-xl text-blue-600">⟲</span>
        <h3 className="text-lg font-semibold text-gray-900">EMI Calculator</h3>
      </div>

      <p className="mt-3 text-sm text-gray-700">
        Estimated Monthly Payment:{" "}
        <span className="font-bold text-black">
          {formatCurrency(monthlyPayment)}
        </span>{" "}
        for {loanTerm} months
      </p>

      <p className="mt-1 text-xs text-gray-500">
        *Based on {formatCurrency(downPaymentAmount)} down payment and {interestRate}% interest rate
      </p>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div className="p-3 rounded-xl bg-gray-50">
          <p className="text-xs text-gray-500">Down Payment</p>
          <p className="mt-1 font-semibold text-gray-900">{formatCurrency(downPaymentAmount)}</p>
        </div>
        <div className="p-3 rounded-xl bg-gray-50">
          <p className="text-xs text-gray-500">Loan Amount</p>
          <p className="mt-1 font-semibold text-gray-900">{formatCurrency(loanAmount)}</p>
        </div>
        <div className="p-3 rounded-xl bg-gray-50">
          <p className="text-xs text-gray-500">Interest</p>
          <p className="mt-1 font-semibold text-gray-900">{formatCurrency(totalInterest)}</p>
        </div>
        <div className="p-3 rounded-xl bg-gray-50">
          <p className="text-xs text-gray-500">Total Payment</p>
          <p className="mt-1 font-semibold text-gray-900">{formatCurrency(totalPayment)}</p>
        </div>
      </div>
    </div>
  );
}

export default EMICalculatorCard;
