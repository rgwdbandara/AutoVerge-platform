const mongoose = require('mongoose');
const Vehicle = mongoose.model('Vehicle', new mongoose.Schema({}, { strict: false }), 'vehicles');

async function compare(names){
  if (!names || names.length===0) return { error: 'no vehicles provided' };
  const regexes = names.map(n=> new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), 'i'));
  const items = await Vehicle.find({ $or: regexes.map(r=>({ title: r })) }).limit(6).lean();

  const comparisons = items.map(i=>({
    id: i._id,
    title: i.title || i.name || `${i.make||''} ${i.model||''}`.trim(),
    price: i.price || i.listPrice || null,
    fuel: i.fuel || i.fuelType || null,
    mileage: i.mileage || i.km || null,
    maintenance: i.maintenanceEstimate || null,
    resale: i.resaleEstimate || null,
    reliability: i.reliability || null,
    image: (i.images && i.images[0]) || i.image || null
  }));

  // basic comparison summary
  const summary = {
    fuelEconomy: 'Based on the listed mileage',
    comfort: 'Comfort varies by model; check seating and suspension details',
    maintenance: 'Maintenance estimated from vehicle age and engine type',
    resale: 'Resale value approximations based on brand and model',
    recommendation: comparisons.length ? comparisons[0].title : null
  };

  return { items: comparisons, summary };
}

module.exports = { compare };
