function ErrorBanner({ message }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="mb-4 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700"
    >
      <span className="mt-0.5 text-base" aria-hidden="true">
        ⚠
      </span>

      <p className="text-sm font-medium leading-5">
        {message}
      </p>
    </div>
  );
}

export default ErrorBanner;