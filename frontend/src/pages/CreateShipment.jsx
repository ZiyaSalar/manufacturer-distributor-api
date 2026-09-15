import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Truck,
  Plus,
  List,
  Package,
  Building2,
  Hash,
  Boxes,
  ArrowRight,
  CalendarDays,
} from "lucide-react";

import PageHeader from "../components/PageHeader";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBanner from "../components/ErrorBanner";
import SuccessBanner from "../components/SuccessBanner";

import { getAllProducts } from "../services/productService";
import {
  getAllShipments,
  createShipment,
} from "../services/shipmentService";

function CreateShipment() {
  const navigate = useNavigate();

  // Product dropdown data
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState(null);

  // Shipment form state
  const [form, setForm] = useState({
    shipmentId: "",
    medicineCode: "",
    // distributorId: "",
    quantity: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  // "View All Shipments" table state
  const [showShipments, setShowShipments] = useState(false);
  const [shipments, setShipments] = useState([]);
  const [loadingShipments, setLoadingShipments] = useState(false);
  const [shipmentsError, setShipmentsError] = useState(null);

  async function loadProducts() {
    setLoadingProducts(true);
    setProductsError(null);

    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      setProductsError(
        "Could not load products. Is Product API running?"
      );
    } finally {
      setLoadingProducts(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  // The manufacturer is derived from the selected product.
  const selectedProduct = products.find(
    (p) => p.MedicineCode === form.medicineCode
  );

  function validateForm() {
    const errors = {};

    if (!form.shipmentId.trim()) {
      errors.shipmentId = "Shipment ID is required";
    }

    if (!form.medicineCode) {
      errors.medicineCode = "Please select a product";
    }

    // if (!form.distributorId.trim()) {
    //   errors.distributorId = "Distributor ID is required";
    // }

    if (form.quantity === "" || Number(form.quantity) <= 0) {
      errors.quantity = "Quantity must be a positive number";
    }

    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSubmitSuccess(null);
    setSubmitError(null);

    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        shipmentId: form.shipmentId,
        medicineCode: form.medicineCode,
        manufacturerId: selectedProduct.ManufacturerId,
        // distributorId: form.distributorId,
        quantity: Number(form.quantity),
      };

      await createShipment(payload);

      setSubmitSuccess(
        `Shipment ${form.shipmentId} recorded successfully.`
      );

      setForm({
        shipmentId: "",
        medicineCode: "",
        distributorId: "",
        quantity: "",
      });

      setFormErrors({});

      if (showShipments) {
        loadShipments();
      }
    } catch (err) {
      const message =
        err.response?.data?.error ||
        "Failed to create shipment.";

      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  }

  async function loadShipments() {
    setLoadingShipments(true);
    setShipmentsError(null);

    try {
      const data = await getAllShipments();
      setShipments(data);
    } catch (err) {
      setShipmentsError("Could not load shipments.");
    } finally {
      setLoadingShipments(false);
    }
  }

  function handleToggleShipments() {
    const next = !showShipments;

    setShowShipments(next);

    if (next) {
      loadShipments();
    }
  }

  function handleFormChange(field, value) {
    setForm({
      ...form,
      [field]: value,
    });

    if (formErrors[field]) {
      setFormErrors({
        ...formErrors,
        [field]: undefined,
      });
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <PageHeader
        title="Create a Shipment"
        subtitle="Record and track pharmaceutical shipments between manufacturers and distributors."
      />

      {/* Main shipment form */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Section header */}
        <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Truck size={20} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Shipment Details
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Enter the details below to record a new shipment.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="space-y-4">
            <SuccessBanner message={submitSuccess} />
            <ErrorBanner message={submitError} />

            {productsError && (
              <ErrorBanner message={productsError} />
            )}
          </div>

          {!loadingProducts &&
          !productsError &&
          products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <Package size={25} />
              </div>

              <h3 className="mt-4 text-sm font-semibold text-gray-900">
                No products available
              </h3>

              <p className="mt-1 max-w-md text-sm leading-5 text-gray-500">
                You need to register a product before creating
                a shipment.
              </p>

              <button
                type="button"
                onClick={() => navigate("/products")}
                className="
                  mt-5 inline-flex items-center gap-2
                  rounded-lg bg-blue-600 px-4 py-2.5
                  text-sm font-medium text-white
                  transition-colors
                  hover:bg-blue-700
                  focus:outline-none focus:ring-2
                  focus:ring-blue-500 focus:ring-offset-2
                "
              >
                <Plus size={16} />
                Register New Product
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Shipment ID */}
                <div>
                  <label
                    htmlFor="shipment-id"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Shipment ID
                  </label>

                  <div className="relative">
                    <Hash
                      size={17}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="shipment-id"
                      type="text"
                      value={form.shipmentId}
                      onChange={(e) =>
                        handleFormChange(
                          "shipmentId",
                          e.target.value
                        )
                      }
                      placeholder="e.g. S008"
                      className={`
                        w-full rounded-lg border bg-white
                        py-2.5 pl-9 pr-3.5 text-sm text-gray-900
                        placeholder:text-gray-400
                        transition-colors
                        focus:outline-none focus:ring-2
                        ${
                          formErrors.shipmentId
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                        }
                      `}
                    />
                  </div>

                  {formErrors.shipmentId && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {formErrors.shipmentId}
                    </p>
                  )}
                </div>

                {/* Distributor ID
                <div>
                  <label
                    htmlFor="distributor-id"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Distributor ID
                  </label>

                  <div className="relative">
                    <Building2
                      size={17}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="distributor-id"
                      type="text"
                      value={form.distributorId}
                      onChange={(e) =>
                        handleFormChange(
                          "distributorId",
                          e.target.value
                        )
                      }
                      placeholder="e.g. DIST-01"
                      className={`
                        w-full rounded-lg border bg-white
                        py-2.5 pl-9 pr-3.5 text-sm text-gray-900
                        placeholder:text-gray-400
                        transition-colors
                        focus:outline-none focus:ring-2
                        ${
                          formErrors.distributorId
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                        }
                      `}
                    />
                  </div>

                  {formErrors.distributorId && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {formErrors.distributorId}
                    </p>
                  )}
                </div> */}

                {/* Product */}
                <div>
                  <label
                    htmlFor="medicine-code"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Product
                  </label>

                  {loadingProducts ? (
                    <div className="rounded-lg border border-gray-200 bg-gray-50">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <select
                      id="medicine-code"
                      value={form.medicineCode}
                      onChange={(e) =>
                        handleFormChange(
                          "medicineCode",
                          e.target.value
                        )
                      }
                      className={`
                        w-full rounded-lg border bg-white
                        px-3.5 py-2.5 text-sm text-gray-900
                        transition-colors
                        focus:outline-none focus:ring-2
                        ${
                          formErrors.medicineCode
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                        }
                      `}
                    >
                      <option value="">
                        Select a product
                      </option>

                      {products.map((p) => (
                        <option
                          key={p.MedicineCode}
                          value={p.MedicineCode}
                        >
                          {p.MedicineName} ({p.MedicineCode})
                        </option>
                      ))}
                    </select>
                  )}

                  {formErrors.medicineCode && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {formErrors.medicineCode}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => navigate("/products")}
                    className="
                      mt-2 inline-flex items-center gap-1.5
                      text-xs font-medium text-blue-600
                      transition-colors hover:text-blue-700
                      focus:outline-none focus:underline
                    "
                  >
                    <Plus size={14} />
                    Register a new product
                  </button>
                </div>

                {/* Quantity */}
                <div>
                  <label
                    htmlFor="quantity"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Quantity
                  </label>

                  <div className="relative">
                    <Boxes
                      size={17}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="quantity"
                      type="number"
                      min="1"
                      value={form.quantity}
                      onChange={(e) =>
                        handleFormChange(
                          "quantity",
                          e.target.value
                        )
                      }
                      placeholder="e.g. 200"
                      className={`
                        w-full rounded-lg border bg-white
                        py-2.5 pl-9 pr-3.5 text-sm text-gray-900
                        placeholder:text-gray-400
                        transition-colors
                        focus:outline-none focus:ring-2
                        ${
                          formErrors.quantity
                            ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                        }
                      `}
                    />
                  </div>

                  {formErrors.quantity ? (
                    <p className="mt-1.5 text-xs text-red-600">
                      {formErrors.quantity}
                    </p>
                  ) : (
                    <p className="mt-1.5 text-xs text-gray-400">
                      Enter the number of units being shipped.
                    </p>
                  )}
                </div>
              </div>

              {/* Derived manufacturer */}
              {selectedProduct && (
                <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50/60 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                      <Building2 size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
                        Manufacturer
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {selectedProduct.ManufacturerId}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-500">
                        Automatically derived from the selected
                        product.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit section */}
              <div className="mt-6 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-gray-400">
                  Please verify the shipment details before
                  recording it.
                </p>

                <button
                  type="submit"
                  disabled={submitting}
                  className="
                    inline-flex items-center justify-center gap-2
                    rounded-lg bg-blue-600 px-5 py-2.5
                    text-sm font-medium text-white
                    transition-all duration-150
                    hover:bg-blue-700
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    focus:outline-none
                    focus:ring-2 focus:ring-blue-500
                    focus:ring-offset-2
                  "
                >
                  <Truck size={17} />

                  {submitting
                    ? "Recording..."
                    : "Create Shipment"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Shipments section */}
      <section className="mt-6">
        <button
          type="button"
          onClick={handleToggleShipments}
          className="
            group flex w-full items-center justify-between
            rounded-xl border border-gray-200 bg-white
            px-5 py-4 text-left shadow-sm
            transition-all duration-200
            hover:border-gray-300 hover:shadow-md
            focus:outline-none focus:ring-2
            focus:ring-blue-500 focus:ring-offset-2
          "
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
              <List size={18} />
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900">
                {showShipments
                  ? "All Shipments"
                  : "View All Shipments"}
              </p>

              <p className="mt-0.5 text-xs text-gray-500">
                {showShipments
                  ? "Currently showing recorded shipments"
                  : "View previously recorded shipments"}
              </p>
            </div>
          </div>

          <ArrowRight
            size={18}
            className={`text-gray-400 transition-transform duration-200 ${
              showShipments
                ? "rotate-90 text-blue-600"
                : "group-hover:translate-x-0.5"
            }`}
          />
        </button>

        {showShipments && (
          <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {loadingShipments ? (
              <LoadingSpinner />
            ) : shipmentsError ? (
              <div className="p-5 sm:p-6">
                <ErrorBanner message={shipmentsError} />
              </div>
            ) : shipments.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                  <Truck size={22} />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-gray-900">
                  No shipments recorded
                </h3>

                <p className="mt-1 max-w-sm text-sm text-gray-500">
                  Shipments you create will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-sm">
                  <thead className="border-b border-gray-100 bg-gray-50">
                    <tr className="text-left">
                      <th className="px-5 py-3.5 font-medium text-gray-500">
                        Shipment ID
                      </th>

                      <th className="px-5 py-3.5 font-medium text-gray-500">
                        Product
                      </th>

                      <th className="px-5 py-3.5 font-medium text-gray-500">
                        Manufacturer
                      </th>

                      {/* <th className="px-5 py-3.5 font-medium text-gray-500">
                        Distributor
                      </th> */}

                      <th className="px-5 py-3.5 text-right font-medium text-gray-500">
                        Quantity
                      </th>

                      <th className="px-5 py-3.5 font-medium text-gray-500">
                        Date
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {shipments.map((s) => (
                      <tr
                        key={s.ShipmentId}
                        className="transition-colors hover:bg-gray-50"
                      >
                        <td className="px-5 py-4 font-medium text-gray-900">
                          {s.ShipmentId}
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                            <Package size={13} />
                            {s.MedicineCode}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {s.ManufacturerId}
                        </td>

                        {/* <td className="px-5 py-4 text-gray-600">
                          {s.DistributorId}
                        </td> */}

                        <td className="px-5 py-4 text-right">
                          <span className="font-semibold text-gray-900">
                            {s.Quantity}
                          </span>
                          <span className="ml-1 text-xs text-gray-400">
                            units
                          </span>
                        </td>

                        <td className="px-5 py-4 text-gray-500">
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays size={14} />
                            {new Date(
                              s.ShipmentDate
                            ).toLocaleDateString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default CreateShipment;