import { useState, useEffect } from "react";
import {
  PackagePlus,
  Plus,
  List,
  Hash,
  Pill,
  Building2,
  ArrowRight,
  X,
} from "lucide-react";

import PageHeader from "../components/PageHeader";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBanner from "../components/ErrorBanner";
import SuccessBanner from "../components/SuccessBanner";
import Modal from "../components/Modal";

import {
  getAllManufacturers,
  createManufacturer,
} from "../services/manufacturerService";

import {
  getAllProducts,
  createProduct,
} from "../services/productService";

function RegisterProduct() {
  // Manufacturer dropdown data
  const [manufacturers, setManufacturers] = useState([]);
  const [loadingManufacturers, setLoadingManufacturers] = useState(true);
  const [manufacturersError, setManufacturersError] = useState(null);

  // Product form state
  const [form, setForm] = useState({
    medicineCode: "",
    medicineName: "",
    manufacturerId: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  // Register new manufacturer modal state
  const [showManufacturerModal, setShowManufacturerModal] = useState(false);

  const [manufacturerForm, setManufacturerForm] = useState({
    manufacturerId: "",
    manufacturerName: "",
  });

  const [manufacturerFormErrors, setManufacturerFormErrors] = useState({});
  const [manufacturerSubmitting, setManufacturerSubmitting] = useState(false);
  const [manufacturerSubmitError, setManufacturerSubmitError] = useState(null);

  // View all products state
  const [showProducts, setShowProducts] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState(null);

  async function loadManufacturers() {
    setLoadingManufacturers(true);
    setManufacturersError(null);

    try {
      const data = await getAllManufacturers();
      setManufacturers(data);
    } catch (err) {
      setManufacturersError(
        "Could not load manufacturers. Is Product API running?"
      );
    } finally {
      setLoadingManufacturers(false);
    }
  }

  useEffect(() => {
    loadManufacturers();
  }, []);

  function validateProductForm() {
    const errors = {};

    if (!form.medicineCode.trim()) {
      errors.medicineCode = "Medicine code is required";
    }

    if (!form.medicineName.trim()) {
      errors.medicineName = "Medicine name is required";
    }

    if (!form.manufacturerId) {
      errors.manufacturerId = "Please select a manufacturer";
    }

    return errors;
  }

  async function handleProductSubmit(e) {
    e.preventDefault();

    setSubmitSuccess(null);
    setSubmitError(null);

    const errors = validateProductForm();

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      await createProduct(form);

      setSubmitSuccess(
        `Product ${form.medicineCode} registered successfully.`
      );

      setForm({
        medicineCode: "",
        medicineName: "",
        manufacturerId: "",
      });

      setFormErrors({});

      if (showProducts) {
        loadProducts();
      }
    } catch (err) {
      const message =
        err.response?.data?.error ||
        "Failed to register product.";

      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  }

  function validateManufacturerForm() {
    const errors = {};

    if (!manufacturerForm.manufacturerId.trim()) {
      errors.manufacturerId = "Manufacturer ID is required";
    }

    if (!manufacturerForm.manufacturerName.trim()) {
      errors.manufacturerName = "Manufacturer name is required";
    }

    return errors;
  }

  async function handleManufacturerSubmit(e) {
    e.preventDefault();

    setManufacturerSubmitError(null);

    const errors = validateManufacturerForm();

    setManufacturerFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setManufacturerSubmitting(true);

    try {
      const created = await createManufacturer(manufacturerForm);

      await loadManufacturers();

      setForm((prev) => ({
        ...prev,
        manufacturerId: created.manufacturerId,
      }));

      setManufacturerForm({
        manufacturerId: "",
        manufacturerName: "",
      });

      setManufacturerFormErrors({});
      setShowManufacturerModal(false);
    } catch (err) {
      const message =
        err.response?.data?.error ||
        "Failed to register manufacturer.";

      setManufacturerSubmitError(message);
    } finally {
      setManufacturerSubmitting(false);
    }
  }

  async function loadProducts() {
    setLoadingProducts(true);
    setProductsError(null);

    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      setProductsError("Could not load products.");
    } finally {
      setLoadingProducts(false);
    }
  }

  function handleToggleProducts() {
    const next = !showProducts;

    setShowProducts(next);

    if (next) {
      loadProducts();
    }
  }

  function handleProductChange(field, value) {
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

  function handleManufacturerChange(field, value) {
    setManufacturerForm({
      ...manufacturerForm,
      [field]: value,
    });

    if (manufacturerFormErrors[field]) {
      setManufacturerFormErrors({
        ...manufacturerFormErrors,
        [field]: undefined,
      });
    }
  }

  function handleOpenManufacturerModal() {
    setManufacturerSubmitError(null);
    setManufacturerFormErrors({});
    setShowManufacturerModal(true);
  }

  function handleCloseManufacturerModal() {
    if (manufacturerSubmitting) {
      return;
    }

    setShowManufacturerModal(false);
    setManufacturerSubmitError(null);
    setManufacturerFormErrors({});
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <PageHeader
        title="Register a Product"
        subtitle="Add a new medicine to the product catalog and associate it with a manufacturer."
      />

      {/* Product registration form */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Section header */}
        <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <PackagePlus size={20} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Product Details
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Enter the basic information for the new product.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {/* Feedback messages */}
          <div className="space-y-3">
            <SuccessBanner message={submitSuccess} />
            <ErrorBanner message={submitError} />
          </div>

          <form onSubmit={handleProductSubmit}>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Medicine Code */}
              <div>
                <label
                  htmlFor="medicine-code"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Medicine Code
                </label>

                <div className="relative">
                  <Hash
                    size={17}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="medicine-code"
                    type="text"
                    value={form.medicineCode}
                    onChange={(e) =>
                      handleProductChange(
                        "medicineCode",
                        e.target.value
                      )
                    }
                    placeholder="e.g. P006"
                    className={`
                      w-full rounded-lg border bg-white
                      py-2.5 pl-9 pr-3.5 text-sm text-gray-900
                      placeholder:text-gray-400
                      transition-colors
                      focus:outline-none focus:ring-2
                      ${
                        formErrors.medicineCode
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                      }
                    `}
                  />
                </div>

                {formErrors.medicineCode && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {formErrors.medicineCode}
                  </p>
                )}
              </div>

              {/* Medicine Name */}
              <div>
                <label
                  htmlFor="medicine-name"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Medicine Name
                </label>

                <div className="relative">
                  <Pill
                    size={17}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="medicine-name"
                    type="text"
                    value={form.medicineName}
                    onChange={(e) =>
                      handleProductChange(
                        "medicineName",
                        e.target.value
                      )
                    }
                    placeholder="e.g. Azithromycin 250mg"
                    className={`
                      w-full rounded-lg border bg-white
                      py-2.5 pl-9 pr-3.5 text-sm text-gray-900
                      placeholder:text-gray-400
                      transition-colors
                      focus:outline-none focus:ring-2
                      ${
                        formErrors.medicineName
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                      }
                    `}
                  />
                </div>

                {formErrors.medicineName && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {formErrors.medicineName}
                  </p>
                )}
              </div>

              {/* Manufacturer */}
              <div className="md:col-span-2">
                <label
                  htmlFor="manufacturer"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Manufacturer
                </label>

                {loadingManufacturers ? (
                  <div className="rounded-lg border border-gray-200 bg-gray-50">
                    <LoadingSpinner />
                  </div>
                ) : manufacturersError ? (
                  <ErrorBanner message={manufacturersError} />
                ) : (
                  <select
                    id="manufacturer"
                    value={form.manufacturerId}
                    onChange={(e) =>
                      handleProductChange(
                        "manufacturerId",
                        e.target.value
                      )
                    }
                    className={`
                      w-full rounded-lg border bg-white
                      px-3.5 py-2.5 text-sm text-gray-900
                      transition-colors
                      focus:outline-none focus:ring-2
                      ${
                        formErrors.manufacturerId
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                      }
                    `}
                  >
                    <option value="">
                      Select a manufacturer
                    </option>

                    {manufacturers.map((m) => (
                      <option
                        key={m.ManufacturerId}
                        value={m.ManufacturerId}
                      >
                        {m.ManufacturerName} ({m.ManufacturerId})
                      </option>
                    ))}
                  </select>
                )}

                {formErrors.manufacturerId && (
                  <p className="mt-1.5 text-xs text-red-600">
                    {formErrors.manufacturerId}
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleOpenManufacturerModal}
                  className="
                    mt-2 inline-flex items-center gap-1.5
                    text-xs font-medium text-blue-600
                    transition-colors hover:text-blue-700
                    focus:outline-none focus:underline
                  "
                >
                  <Plus size={14} />
                  Register a new manufacturer
                </button>
              </div>
            </div>

            {/* Form footer */}
            <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-gray-400">
                Make sure the medicine code and manufacturer
                information are correct before registering.
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
                <PackagePlus size={17} />

                {submitting
                  ? "Registering..."
                  : "Register Product"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Products section */}
      <section className="mt-6">
        <button
          type="button"
          onClick={handleToggleProducts}
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
                {showProducts
                  ? "All Products"
                  : "View All Products"}
              </p>

              <p className="mt-0.5 text-xs text-gray-500">
                {showProducts
                  ? "Currently showing registered products"
                  : "View products already registered in the catalog"}
              </p>
            </div>
          </div>

          <ArrowRight
            size={18}
            className={`text-gray-400 transition-transform duration-200 ${
              showProducts
                ? "rotate-90 text-blue-600"
                : "group-hover:translate-x-0.5"
            }`}
          />
        </button>

        {showProducts && (
          <div className="mt-4 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {loadingProducts ? (
              <LoadingSpinner />
            ) : productsError ? (
              <div className="p-5 sm:p-6">
                <ErrorBanner message={productsError} />
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                  <PackagePlus size={22} />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-gray-900">
                  No products registered
                </h3>

                <p className="mt-1 max-w-sm text-sm text-gray-500">
                  Products you register will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-sm">
                  <thead className="border-b border-gray-100 bg-gray-50">
                    <tr className="text-left">
                      <th className="px-5 py-3.5 font-medium text-gray-500">
                        Product Code
                      </th>

                      <th className="px-5 py-3.5 font-medium text-gray-500">
                        Product Name
                      </th>

                      <th className="px-5 py-3.5 font-medium text-gray-500">
                        Manufacturer
                      </th>

                      <th className="px-5 py-3.5 font-medium text-gray-500">
                        Status
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {products.map((p) => (
                      <tr
                        key={p.MedicineCode}
                        className="transition-colors hover:bg-gray-50"
                      >
                        <td className="px-5 py-4 font-medium text-gray-900">
                          {p.MedicineCode}
                        </td>

                        <td className="px-5 py-4 text-gray-700">
                          {p.MedicineName}
                        </td>

                        <td className="px-5 py-4 text-gray-600">
                          {p.ManufacturerId}
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                            {p.Status}
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

      {/* Register manufacturer modal */}
      <Modal
        isOpen={showManufacturerModal}
        onClose={handleCloseManufacturerModal}
        title="Register New Manufacturer"
      >
        <div className="mb-5 rounded-lg bg-blue-50 px-4 py-3">
          <div className="flex items-start gap-3">
            <Building2
              size={18}
              className="mt-0.5 shrink-0 text-blue-600"
            />

            <p className="text-xs leading-5 text-blue-800">
              Add a manufacturer to the system. Once registered,
              it will be automatically selected for this product.
            </p>
          </div>
        </div>

        <ErrorBanner message={manufacturerSubmitError} />

        <form
          onSubmit={handleManufacturerSubmit}
          className="space-y-5"
        >
          {/* Manufacturer ID */}
          <div>
            <label
              htmlFor="manufacturer-id"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Manufacturer ID
            </label>

            <div className="relative">
              <Hash
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="manufacturer-id"
                type="text"
                value={manufacturerForm.manufacturerId}
                onChange={(e) =>
                  handleManufacturerChange(
                    "manufacturerId",
                    e.target.value
                  )
                }
                placeholder="e.g. M004"
                className={`
                  w-full rounded-lg border bg-white
                  py-2.5 pl-9 pr-3.5 text-sm text-gray-900
                  placeholder:text-gray-400
                  transition-colors
                  focus:outline-none focus:ring-2
                  ${
                    manufacturerFormErrors.manufacturerId
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                  }
                `}
              />
            </div>

            {manufacturerFormErrors.manufacturerId && (
              <p className="mt-1.5 text-xs text-red-600">
                {manufacturerFormErrors.manufacturerId}
              </p>
            )}
          </div>

          {/* Manufacturer Name */}
          <div>
            <label
              htmlFor="manufacturer-name"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Manufacturer Name
            </label>

            <div className="relative">
              <Building2
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                id="manufacturer-name"
                type="text"
                value={manufacturerForm.manufacturerName}
                onChange={(e) =>
                  handleManufacturerChange(
                    "manufacturerName",
                    e.target.value
                  )
                }
                placeholder="e.g. Manufacturer D"
                className={`
                  w-full rounded-lg border bg-white
                  py-2.5 pl-9 pr-3.5 text-sm text-gray-900
                  placeholder:text-gray-400
                  transition-colors
                  focus:outline-none focus:ring-2
                  ${
                    manufacturerFormErrors.manufacturerName
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20"
                  }
                `}
              />
            </div>

            {manufacturerFormErrors.manufacturerName && (
              <p className="mt-1.5 text-xs text-red-600">
                {manufacturerFormErrors.manufacturerName}
              </p>
            )}
          </div>

          {/* Modal actions */}
          <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCloseManufacturerModal}
              disabled={manufacturerSubmitting}
              className="
                inline-flex items-center justify-center gap-2
                rounded-lg border border-gray-200 bg-white
                px-4 py-2.5 text-sm font-medium text-gray-700
                transition-colors
                hover:bg-gray-50
                disabled:cursor-not-allowed disabled:opacity-50
                focus:outline-none focus:ring-2
                focus:ring-gray-300 focus:ring-offset-1
              "
            >
              <X size={16} />
              Cancel
            </button>

            <button
              type="submit"
              disabled={manufacturerSubmitting}
              className="
                inline-flex items-center justify-center gap-2
                rounded-lg bg-blue-600 px-4 py-2.5
                text-sm font-medium text-white
                transition-colors
                hover:bg-blue-700
                disabled:cursor-not-allowed disabled:opacity-60
                focus:outline-none focus:ring-2
                focus:ring-blue-500 focus:ring-offset-2
              "
            >
              <Building2 size={16} />

              {manufacturerSubmitting
                ? "Registering..."
                : "Register Manufacturer"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default RegisterProduct;