/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import SuggestedPrompts from './SuggestedPrompts';
import RecommendationCard from './RecommendationCard';
import './chatbot.css';

export default function ChatWindow(){
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const boxRef = useRef();

  useEffect(()=>{ if(open) boxRef.current?.scrollTo(0, boxRef.current.scrollHeight); }, [messages, open]);

  const send = async (text) => {
    if(!text) return;
    const userMsg = { role: 'user', text };
    setMessages(prev=>[...prev, userMsg]);
    setInput('');
    setLoading(true);

    try{
      const resp = await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ message: text }) });
      const data = await resp.json();
      const reply = data.reply;

      if(reply.type==='recommendation'){
        setMessages(prev=>[...prev, { role:'assistant', type:'recommendation', items: reply.items }]);
      } else if (reply.type==='emi'){
        setMessages(prev=>[...prev, { role:'assistant', type:'emi', calculation: reply.calculation }]);
      } else if (reply.type==='comparison'){
        setMessages(prev=>[...prev, { role:'assistant', type:'comparison', comp: reply.comp }]);
      } else {
        setMessages(prev=>[...prev, { role:'assistant', type:'text', text: reply.text || JSON.stringify(reply) }]);
      }
    }catch(e){
      setMessages(prev=>[...prev, { role:'assistant', type:'text', text:'Service unavailable' }]);
    } finally { setLoading(false); }
  };

  return (
    <div className={`av-chatbot ${open? 'open':''}`}>
      <button className="av-toggle" onClick={()=>setOpen(o=>!o)}>AutoVerge AI Assistant</button>
      {open && (
        <div className="av-panel">
          <div className="av-header">AutoVerge AI Assistant</div>
          <div className="av-body" ref={boxRef}>
            <SuggestedPrompts onClick={send} />
            {messages.map((m,i)=> (
              <ChatMessage key={i} message={m} />
            ))}
            {loading && <div className="typing">AutoVerge is typing<span className="dots">...</span></div>}
          </div>
          <div className="av-input">
            <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask in Sinhala or English..." onKeyDown={e=>{ if(e.key==='Enter') send(input); }} />
            <button onClick={()=>send(input)}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}
