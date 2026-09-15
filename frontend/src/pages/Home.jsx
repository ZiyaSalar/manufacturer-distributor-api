import { useNavigate } from "react-router-dom";
import {
  PackagePlus,
  Truck,
  ClipboardList,
  ArrowRight,
} from "lucide-react";
import FeatureCard from "../components/FeatureCard";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Dashboard introduction */}
      <div className="max-w-3xl">
        <div className="mb-4 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          Pharmaceutical Management
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Manufacturer–Distributor API Dashboard
        </h1>

        {/* <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
          Manage products, record shipments, and monitor inventory
          from one place.
        </p> */}
      </div>

      {/* Quick actions */}
      <div className="mt-8 sm:mt-10">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Select an action to continue.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FeatureCard
            icon={<PackagePlus size={24} />}
            title="Register a Product"
            description="Add a new medicine to the product catalog under a manufacturer."
            onClick={() => navigate("/products")}
          />

          <FeatureCard
            icon={<Truck size={24} />}
            title="Create a Shipment"
            description="Record a new shipment for an existing product."
            onClick={() => navigate("/shipments")}
          />

          <FeatureCard
            icon={<ClipboardList size={24} />}
            title="Check Inventory"
            description="View current stock levels across all products."
            onClick={() => navigate("/inventory")}
          />
        </div>
      </div>

      {/* Simple workflow hint */}
      {/* <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm">
            <ArrowRight size={18} />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-800">
              Recommended workflow
            </p>

            <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
              Register your products first, then create shipments
              and monitor inventory as stock moves through the
              distribution process.
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default Home;