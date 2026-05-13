import React from 'react';

const SUGGESTIONS = [
  'Best SUV under 15 million',
  'Fuel efficient family cars',
  'Aqua vs Fit',
  'Monthly EMI calculator',
  'Best hybrid cars in Sri Lanka'
];

export default function SuggestedPrompts({ onClick }){
  return (
    <div className="suggestions">
      {SUGGESTIONS.map(s=> <button key={s} onClick={()=>onClick(s)} className="suggest">{s}</button>)}
    </div>
  );
}
