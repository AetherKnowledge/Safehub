import React from "react";
import { IoStar, IoStarHalf, IoStarOutline } from "react-icons/io5";

interface StarRatingProps {
  rating: number; // can be fractional, e.g., 3.5
  max?: number; // default 5
  size?: number; // icon size in px
  className?: string;
}

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

const StarRating = ({
  rating,
  max = 5,
  size = 18,
  className,
}: StarRatingProps) => {
  const safeMax = Math.max(1, Math.floor(max));
  const r = clamp(rating, 0, safeMax);

  // Determine how many full, half, and empty stars
  const full = Math.floor(r);
  const hasHalf = r - full >= 0.25 && r - full < 0.75; // show half for ~[.25, .75)
  const roundedUp = r - full >= 0.75; // treat as full
  const totalFull = full + (roundedUp ? 1 : 0);
  const totalHalf = !roundedUp && hasHalf ? 1 : 0;
  const totalEmpty = Math.max(0, safeMax - totalFull - totalHalf);

  const items: React.ReactNode[] = [];
  for (let i = 0; i < totalFull; i++) {
    items.push(
      <IoStar
        key={`full-${i}`}
        size={size}
        className="text-primary"
        aria-label="full star"
      />
    );
  }
  if (totalHalf === 1) {
    items.push(
      <IoStarHalf
        key={`half`}
        size={size}
        className="text-primary"
        aria-label="half star"
      />
    );
  }
  for (let i = 0; i < totalEmpty; i++) {
    // When not starred it should be bg-base-content/10
    items.push(
      <IoStarOutline
        key={`empty-${i}`}
        size={size}
        className="text-base-content/10"
        aria-label="empty star"
      />
    );
  }

  return (
    <div className={`inline-flex items-center gap-0.5 ${className || ""}`}>
      {items}
    </div>
  );
};

export default StarRating;
