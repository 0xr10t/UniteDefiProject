/* filepath: /home/yash/UniteDefi/frontend/Frontend/src/components/ui/Card.jsx */
import React from 'react';

const Card = ({ children, className = '', gradient = false, glass = false }) => {
  const baseStyles = "rounded-xl border backdrop-blur-sm transition-all duration-300 select-none";
  const glassStyles = glass ? "bg-white/5 border-white/10 hover:bg-white/10" : "";
  const gradientStyles = gradient ? "bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30" : "bg-black/20 border-purple-500/50";
  
  return (
    <div className={`${baseStyles} ${glass ? glassStyles : gradientStyles} ${className}`}>
      {children}
    </div>
  );
};

export default Card;