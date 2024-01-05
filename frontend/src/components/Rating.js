import React, { useState } from 'react';

const Rating = ({ value, text, color, hoverText }) => {
  const [isHovered, setIsHovered] = useState(false);

  const tooltipStyle = {
    position: 'absolute',
    backgroundColor: 'black',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '4px',
    fontSize: '12px',
    zIndex: 1000,
    whiteSpace: 'nowrap',
    visibility: isHovered ? 'visible' : 'hidden', // Show based on hover state
    opacity: isHovered ? 1 : 0,
    transition: 'opacity 0.2s ease',
    // Adjust positioning as needed
    left: '50%',
    top: '100%',
    transform: 'translateX(-50%)'
  };

  return (
    <div className='rating' style={{ position: 'relative' }}>
      {[...Array(5)].map((_, index) => (
        <span key={index}>
          <i
            style={{ color }}
            className={
              value >= index + 1
                ? 'fas fa-star'
                : value >= index + 0.5
                ? 'fas fa-star-half-alt'
                : 'far fa-star'
            }
          ></i>
        </span>
      ))}
      <span 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {text && text}
        <div style={tooltipStyle}>Not enough customer reviews for accurate seller rating.</div>
      </span>
    </div>
  );
};

Rating.defaultProps = {
  color: '#f8e825',
};

export default Rating;
