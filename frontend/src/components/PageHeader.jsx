import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function PageHeader({ title, subtitle }) {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <button
        type="button"
        onClick={() => navigate("/")}
        className="
          group mb-5 inline-flex items-center gap-2
          rounded-lg px-2 py-1.5
          text-sm font-medium text-gray-500
          transition-colors duration-150
          hover:bg-gray-100 hover:text-gray-800
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
        "
      >
        <ArrowLeft
          size={17}
          strokeWidth={2}
          className="transition-transform duration-150 group-hover:-translate-x-0.5"
        />
        <span>Back to Home</span>
      </button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export default PageHeader;