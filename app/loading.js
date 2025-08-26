export default function Loading() {
  return (
    <div className="fixed inset-0 z-[900] grid place-items-center bg-white/80">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/30 border-t-black" />
    </div>
  );
}


