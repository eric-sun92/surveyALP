import React from 'react'

const Rating = ({ value, text, color, hoverText }) => {
  return (
    <div className='rating'>
      {[...Array(5)].map((_, index) => (
        <span key={index}>
          <i
            style={{ color }}
            title={hoverText}  // Add the title attribute here
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
      <span>{text && text}</span>
    </div>
  )
}

Rating.defaultProps = {
  color: '#f8e825',
}

export default Rating
