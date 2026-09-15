function FeatureCard({ icon, title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group w-full rounded-xl border border-gray-200 bg-white
        p-5 text-left shadow-sm
        transition-all duration-200
        hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className="
            flex h-11 w-11 shrink-0 items-center justify-center
            rounded-lg bg-blue-50 text-blue-600
            transition-colors duration-200
            group-hover:bg-blue-100
          "
        >
          {icon}
        </div>

        <span
          className="
            text-gray-300 transition-all duration-200
            group-hover:translate-x-0.5 group-hover:text-blue-500
          "
          aria-hidden="true"
        >
          →
        </span>
      </div>

      <div className="mt-5">
        <h3 className="text-base font-semibold text-gray-900">
          {title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          {description}
        </p>
      </div>
    </button>
  );
}

export default FeatureCard;