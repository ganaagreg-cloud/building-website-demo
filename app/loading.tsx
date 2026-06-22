export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <span
        className="block w-8 h-8 rounded-full border-2 border-oak border-t-transparent animate-spin"
        aria-label="Ачаалж байна"
        role="status"
      />
    </div>
  )
}
