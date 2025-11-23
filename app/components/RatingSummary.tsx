import StarRating from "./StarRating";

export interface RatingSummaryProps {
  ratings: number[];
  className?: string;
  // Customize colors if needed
  barColorClassName?: string; // e.g., "bg-green-600"
  barBgClassName?: string; // e.g., "bg-gray-200"
}

function formatNumber(n: number) {
  return new Intl.NumberFormat().format(n);
}

function clampToRange(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function RatingSummary({
  ratings,
  className,
  barColorClassName = "bg-primary",
  barBgClassName = "bg-base-content/10",
}: RatingSummaryProps) {
  const total = ratings.length;

  const counts = [0, 0, 0, 0, 0]; // index 0 => 1-star, 4 => 5-star
  let sum = 0;
  if (ratings && total > 0) {
    for (const r of ratings) {
      const rating = clampToRange(Math.round(Number(r)), 1, 5);
      counts[rating - 1] += 1;
      sum += rating;
    }
  }

  const avg = total > 0 ? sum / total : 0;

  // Build rows from 5 down to 1 stars
  const rows = [5, 4, 3, 2, 1].map((stars) => {
    const c = counts[stars - 1];
    const pct = total > 0 ? (c / total) * 100 : 0;
    return { stars, count: c, percent: pct };
  });

  return (
    <div className={"flex w-full items-center gap-6 ml-5" + (className || "")}>
      {/* Left summary */}
      <div className="flex flex-col items-center">
        <div className="text-5xl font-bold leading-none">{avg.toFixed(1)}</div>
        <StarRating rating={avg} size={20} />
        <div className="mt-1 text-sm text-base-content/70">
          {formatNumber(total)}
        </div>
      </div>

      {/* Right distribution */}
      <div className="flex-1 w-full space-y-2">
        {rows.map((row) => (
          <div key={row.stars} className="flex items-center gap-3">
            <div className="w-4 shrink-0 text-sm text-base-content/80">
              {row.stars}
            </div>
            <div className={`relative h-3 flex-1 rounded ${barBgClassName}`}>
              <div
                className={`absolute left-0 top-0 h-3 rounded ${barColorClassName}`}
                style={{ width: `${row.percent}%` }}
                aria-label={`${row.stars} star percentage ${row.percent.toFixed(
                  0
                )}%`}
              />
            </div>
            <div className="w-16 shrink-0 text-left text-sm text-base-content/70 text-ellipsis overflow-hidden">
              {formatNumber(row.count)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
