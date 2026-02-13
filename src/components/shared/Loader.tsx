export function Loader() {
  return (
    <div className="flex items-center justify-center min-h-[120px]" role="status" aria-label="جاري التحميل">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
