import React from 'react';
import RecommendationCard from './RecommendationCard';

export default function ChatMessage({ message }){
  if(message.type==='recommendation'){
    return (
      <div className="msg assistant">
        <div className="rec-grid">
          {message.items.map(it=> <RecommendationCard key={it.id} item={it} />)}
        </div>
      </div>
    );
  }

  if(message.type==='emi'){
    return (
      <div className={`msg assistant`}>
        <div>
          <strong>Estimated monthly:</strong> Rs. {message.calculation.monthly}<br/>
          <strong>Down payment:</strong> Rs. {message.calculation.downPayment}<br/>
          <strong>Loan principal:</strong> Rs. {message.calculation.principal}
        </div>
      </div>
    );
  }

  if(message.role==='user'){
    return <div className="msg user">{message.text}</div>;
  }

  return <div className="msg assistant">{message.text}</div>;
}
