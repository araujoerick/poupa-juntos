export default function LearnLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="h-3 w-32 bg-muted rounded-md" />
          <div className="h-6 w-48 bg-muted rounded-md" />
        </div>
        <div className="h-7 w-16 bg-muted rounded-full" />
      </div>

      {/* Featured card skeleton */}
      <div className="h-44 bg-muted rounded-2xl" />

      {/* Pills skeleton */}
      <div className="flex gap-2">
        {[80, 72, 104, 88, 64].map((w, i) => (
          <div
            key={i}
            className="h-7 bg-muted rounded-full shrink-0"
            style={{ width: w }}
          />
        ))}
      </div>

      {/* Article grid skeleton */}
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-36 bg-muted rounded-2xl" />
        ))}
      </div>

      {/* Quiz skeleton */}
      <div className="h-32 bg-muted rounded-2xl" />
    </div>
  );
}
