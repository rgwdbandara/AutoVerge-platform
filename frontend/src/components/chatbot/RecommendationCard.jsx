import React from 'react';

export default function RecommendationCard({ item }){
  return (
    <div className="rec-card">
      {item.image && <img src={item.image} alt={item.title} />}
      <div className="rec-body">
        <div className="rec-title">{item.title}</div>
        <div className="rec-meta">Rs. {item.price?.toLocaleString() || 'N/A'} • {item.fuel || '—'}</div>
        <div className="rec-actions"><button className="view">View Car</button></div>
      </div>
    </div>
  );
}
