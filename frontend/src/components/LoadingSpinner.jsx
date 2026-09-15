function LoadingSpinner() {
  return (
    <div
      className="flex w-full items-center justify-center py-10"
      role="status"
      aria-label="Loading"
    >
      <div
        className="
          h-9 w-9 animate-spin rounded-full
          border-[3px] border-gray-200 border-t-blue-600
        "
        aria-hidden="true"
      ></div>

      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default LoadingSpinner;