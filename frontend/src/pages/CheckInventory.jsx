import { useState } from "react";
import { ClipboardList, Search, Boxes, PackageSearch } from "lucide-react";
import PageHeader from "../components/PageHeader";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBanner from "../components/ErrorBanner";
import {
  getAllInventory,
  getInventoryByCode,
} from "../services/inventoryService";

function CheckInventory() {
  const [mode, setMode] = useState(null);

  const [inventory, setInventory] = useState([]);
  const [loadingAll, setLoadingAll] = useState(false);
  const [allError, setAllError] = useState(null);

  const [medicineCode, setMedicineCode] = useState("");
  const [lookupResult, setLookupResult] = useState(null);
  const [loadingLookup, setLoadingLookup] = useState(false);
  const [lookupError, setLookupError] = useState(null);

  async function handleShowAll() {
    setMode("all");
    setLoadingAll(true);
    setAllError(null);

    try {
      const data = await getAllInventory();
      setInventory(data);
    } catch (err) {
      setAllError(
        "Could not load inventory. Is Inventory API running?"
      );
    } finally {
      setLoadingAll(false);
    }
  }

  function handleShowSingle() {
    setMode("single");
    setLookupResult(null);
    setLookupError(null);
  }

  async function handleLookup(e) {
    e.preventDefault();

    if (!medicineCode.trim()) {
      setLookupError("Please enter a Product ID.");
      return;
    }

    setLoadingLookup(true);
    setLookupError(null);
    setLookupResult(null);

    try {
      const data = await getInventoryByCode(medicineCode.trim());
      setLookupResult(data);
    } catch (err) {
      if (err.response?.status === 404) {
        setLookupError(
          `No product found with code "${medicineCode.trim()}".`
        );
      } else {
        setLookupError(
          "Failed to fetch inventory for that product."
        );
      }
    } finally {
      setLoadingLookup(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <PageHeader
        title="Check Inventory"
        subtitle="View current stock levels across your pharmaceutical products."
      />

      {/* Inventory options */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={handleShowAll}
          className={`group relative w-full rounded-xl border p-5 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            mode === "all"
              ? "border-blue-300 bg-blue-50 shadow-sm"
              : "border-gray-200 bg-white shadow-sm hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
                mode === "all"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
              } transition-colors duration-200`}
            >
              <ClipboardList size={21} />
            </div>

            <span
              className={`text-lg ${
                mode === "all"
                  ? "text-blue-600"
                  : "text-gray-300 group-hover:text-blue-500"
              } transition-colors`}
              aria-hidden="true"
            >
              →
            </span>
          </div>

          <div className="mt-4">
            <h2 className="text-base font-semibold text-gray-900">
              Complete Inventory
            </h2>

            <p className="mt-1.5 text-sm leading-5 text-gray-500">
              View stock levels for all products in the system.
            </p>
          </div>

          {mode === "all" && (
            <div className="absolute bottom-0 left-5 right-5 h-0.5 rounded-full bg-blue-600" />
          )}
        </button>

        <button
          type="button"
          onClick={handleShowSingle}
          className={`group relative w-full rounded-xl border p-5 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            mode === "single"
              ? "border-blue-300 bg-blue-50 shadow-sm"
              : "border-gray-200 bg-white shadow-sm hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
                mode === "single"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
              } transition-colors duration-200`}
            >
              <Search size={21} />
            </div>

            <span
              className={`text-lg ${
                mode === "single"
                  ? "text-blue-600"
                  : "text-gray-300 group-hover:text-blue-500"
              } transition-colors`}
              aria-hidden="true"
            >
              →
            </span>
          </div>

          <div className="mt-4">
            <h2 className="text-base font-semibold text-gray-900">
              Product Inventory
            </h2>

            <p className="mt-1.5 text-sm leading-5 text-gray-500">
              Look up the current stock for a specific Product ID.
            </p>
          </div>

          {mode === "single" && (
            <div className="absolute bottom-0 left-5 right-5 h-0.5 rounded-full bg-blue-600" />
          )}
        </button>
      </div>

      {/* Complete inventory */}
      {mode === "all" && (
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                <ClipboardList size={18} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Inventory Overview
                </h2>
                <p className="text-xs text-gray-500">
                  Current stock levels for all products
                </p>
              </div>
            </div>
          </div>

          {loadingAll ? (
            <LoadingSpinner />
          ) : allError ? (
            <div className="p-5 sm:p-6">
              <ErrorBanner message={allError} />
            </div>
          ) : inventory.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <PackageSearch size={22} />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-gray-900">
                No inventory found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-gray-500">
                There are currently no products available in the inventory.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr className="text-left">
                    <th className="px-5 py-3.5 font-medium text-gray-500">
                      Product ID
                    </th>

                    <th className="px-5 py-3.5 font-medium text-gray-500">
                      Product Name
                    </th>

                    <th className="px-5 py-3.5 font-medium text-gray-500">
                      Manufacturer
                    </th>

                    <th className="px-5 py-3.5 text-right font-medium text-gray-500">
                      Current Stock
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {inventory.map((item) => {
                    const stock = Number(item.CurrentStock) || 0;
                    const hasStock = stock > 0;

                    return (
                      <tr
                        key={item.MedicineCode}
                        className="transition-colors hover:bg-gray-50"
                      >
                        <td className="px-5 py-4 font-medium text-gray-900">
                          {item.MedicineCode}
                        </td>

                        <td className="px-5 py-4 text-gray-700">
                          {item.MedicineName}
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {item.ManufacturerName}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <span
                            className={`inline-flex min-w-[60px] items-center justify-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                              hasStock
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {stock}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* Single product lookup */}
      {mode === "single" && (
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Search size={18} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Search Product Inventory
                </h2>

                <p className="text-xs text-gray-500">
                  Enter a Product ID to view its current stock
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <form
              onSubmit={handleLookup}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <div className="flex-1">
                <label
                  htmlFor="medicine-code"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Product ID
                </label>

                <input
                  id="medicine-code"
                  type="text"
                  value={medicineCode}
                  onChange={(e) => setMedicineCode(e.target.value)}
                  placeholder="e.g. P001"
                  autoComplete="off"
                  className="
                    w-full rounded-lg border border-gray-300 bg-white
                    px-3.5 py-2.5 text-sm text-gray-900
                    placeholder:text-gray-400
                    transition-colors
                    focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20
                  "
                />
              </div>

              <div className="sm:self-end">
                <button
                  type="submit"
                  disabled={loadingLookup}
                  className="
                    flex w-full items-center justify-center gap-2
                    rounded-lg bg-blue-600 px-5 py-2.5
                    text-sm font-medium text-white
                    transition-colors
                    hover:bg-blue-700
                    disabled:cursor-not-allowed disabled:opacity-60
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    sm:w-auto
                  "
                >
                  <Search size={16} />

                  {loadingLookup ? "Searching..." : "Search"}
                </button>
              </div>
            </form>

            <div className="mt-4">
              <ErrorBanner message={lookupError} />
            </div>

            {lookupResult && (
              <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <Boxes size={24} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-semibold text-gray-900">
                      {lookupResult.MedicineName}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500">
                      <span>
                        {lookupResult.MedicineCode}
                      </span>

                      <span
                        className="text-gray-300"
                        aria-hidden="true"
                      >
                        •
                      </span>

                      <span>
                        {lookupResult.ManufacturerName}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-3 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0 sm:text-right">
                    <p className="text-2xl font-bold tracking-tight text-gray-900">
                      {lookupResult.CurrentStock}
                    </p>

                    <p className="mt-0.5 text-xs font-medium text-gray-500">
                      units in stock
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default CheckInventory;