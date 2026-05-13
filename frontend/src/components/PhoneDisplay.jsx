import { useState } from "react";

/**
 * Securely displays seller's phone number
 * Shows masked version by default, reveals full number on hover/touch
 */
export function PhoneDisplay({ phone, className = "" }) {
  const [isRevealed, setIsRevealed] = useState(false);

  if (!phone) {
    return <span className={className}>Not provided</span>;
  }

  // Extract only digits
  const digitsOnly = phone.replace(/\D/g, "");
  
  if (digitsOnly.length < 7) {
    return <span className={className}>{phone}</span>;
  }

  // Create masked version: show first 3 and last 2 digits
  // e.g., "+94 71 ••• •••" or "071•••••••2"
  const getMaskedPhone = () => {
    const firstPart = digitsOnly.substring(0, 3); // "071" or "94" + first digit
    const lastPart = digitsOnly.substring(digitsOnly.length - 2); // Last 2 digits
    const masked = firstPart + "•".repeat(Math.max(0, digitsOnly.length - 5)) + lastPart;
    
    // Format with spaces if it's a standard Sri Lankan number
    if (digitsOnly.startsWith("94")) {
      return `+94 ${masked.substring(2, 4)} •••••••${lastPart}`;
    }
    return `${firstPart}•••••${lastPart}`;
  };

  return (
    <span
      onClick={() => setIsRevealed(!isRevealed)}
      onMouseEnter={() => setIsRevealed(true)}
      onMouseLeave={() => setIsRevealed(false)}
      onTouchStart={() => setIsRevealed(true)}
      onTouchEnd={() => setIsRevealed(false)}
      className={`
        cursor-pointer inline-flex items-center gap-2
        transition-all duration-200
        ${isRevealed ? "text-slate-900 font-semibold" : "text-slate-600"}
        ${className}
      `}
      title={isRevealed ? "" : "Click or hover to reveal phone number"}
    >
      {isRevealed ? (
        <>
          <span>{phone}</span>
          <span className="text-xs text-slate-500 opacity-70">(shown)</span>
        </>
      ) : (
        <>
          <span>{getMaskedPhone()}</span>
          <svg
            className="w-4 h-4 text-slate-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-14-14zM2 10a8 8 0 1114.192 5.12.999.999 0 01-1.415-1.414A6 6 0 002 10z" />
          </svg>
        </>
      )}
    </span>
  );
}

export default PhoneDisplay;
