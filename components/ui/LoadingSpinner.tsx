export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[rgb(var(--border))] border-t-[rgb(var(--primary))] rounded-full animate-spin" />
    </div>
  );
}
