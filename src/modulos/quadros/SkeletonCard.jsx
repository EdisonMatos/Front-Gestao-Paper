// components/SkeletonCard.jsx
export default function SkeletonCard() {
  return (
    <div className="p-4 space-y-6 border rounded-md bg-cards border-white/10 animate-pulse">
      <div className="w-3/4 h-4 rounded bg-white/20"></div>
      <div className="w-1/2 h-3 rounded bg-white/10"></div>
    </div>
  );
}
