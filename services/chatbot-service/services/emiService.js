function parseQuery(text){
  // simple parse to find price and period
  const budgetRe = /([0-9,.]+)\s*(million|mn|m)?/i;
  const m = text.match(budgetRe);
  let price = null;
  if (m) {
    price = parseFloat(m[1].replace(/,/g,''));
    if (m[2]) price = price * 1000000;
    else if (price < 1000) price = price * 1000000;
  }

  const yearsRe = /(\d+)\s*(year|yr|years)/i;
  const y = text.match(yearsRe);
  const years = y ? parseInt(y[1],10) : 5;

  const downPctRe = /(\d+)%/;
  const dp = text.match(downPctRe);
  const downPct = dp ? parseInt(dp[1],10)/100 : 0.2;

  const annualRate = 0.12; // default estimate for SL market
  return { price, years, downPct, annualRate };
}

function calculate({ price, years=5, downPct=0.2, annualRate=0.12 }){
  const principal = (price || 0) * (1 - downPct);
  const monthlyRate = annualRate / 12;
  const n = years * 12;
  if (!principal || monthlyRate<=0) return { monthly: 0, principal };

  const r = monthlyRate;
  const monthly = (principal * r * Math.pow(1+r, n)) / (Math.pow(1+r, n) - 1);
  return { monthly: Math.round(monthly), principal: Math.round(principal), years, downPayment: Math.round((price||0)*downPct) };
}

module.exports = { parseQuery, calculate };
