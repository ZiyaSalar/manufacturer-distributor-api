function SuccessBanner({ message }) {
  if (!message) return null;

  return (
    <div
      role="status"
      className="mb-4 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700"
    >
      <span
        className="mt-0.5 text-base font-semibold"
        aria-hidden="true"
      >
        ✓
      </span>

      <p className="text-sm font-medium leading-5">
        {message}
      </p>
    </div>
  );
}

export default SuccessBanner;