import React, { useState } from 'react';

interface StarRatingProps {
  value: number; 
  onChange: (rating: number) => void; 
  readOnly?: boolean; 
}

export const StarRating: React.FC<StarRatingProps> = ({ value, onChange, readOnly = false }) => {
  const [hover, setHover] = useState<number>(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hover || value);

        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            className={`text-3xl transition-colors ${
              isActive ? 'text-yellow-400' : 'text-gray-200'
            } ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}`}
            onClick={() => !readOnly && onChange(star)}
            onMouseEnter={() => !readOnly && setHover(star)}
            onMouseLeave={() => !readOnly && setHover(0)}
          >
            ★
          </button>
        );
      })}
    </div>
  );
};