import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";

const AddItemButtonWithModal = ({ title, fields, onSubmit }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [touched, setTouched] = useState(false); // Track if the form has been touched

    // Validate form fields based on form type (Sale, Customer, Product, Store)
    const validateForm = (updatedFormData) => {
        let validationErrors = {};
        let isValid = true;

        // Determine if the form is for Sale, Customer, Product, or Store
        const requiredFields = fields.map((field) => field.name);

        // Common validation for Customer, Product, and Store
        requiredFields.forEach((field) => {
            if (!updatedFormData[field] || updatedFormData[field] === "Select") {
                validationErrors[field] = `${field} is required.`;
                isValid = false;
            }
        });

        // Sale-specific validation (which includes `dateSold`)
        if (title === "Sale") {
            if (!updatedFormData["dateSold"] || updatedFormData["dateSold"].trim() === "") {
                validationErrors["dateSold"] = "Date Sold is required.";
                isValid = false;
            }
        }

        setErrors(validationErrors);
        setIsFormValid(isValid);
    };

    // Handle input change and update form data
    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedFormData = { ...formData, [name]: value };
        setFormData(updatedFormData);
        setTouched(true); // Mark the form as touched once a user starts interacting
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        validateForm(formData);
        setTouched(true); // Ensure errors show up after submit attempt

        // Only submit if form is valid
        if (isFormValid) {
            onSubmit(formData); // Call onSubmit with formData
            setIsModalOpen(false); // Close modal
            setFormData({}); // Clear form
            setErrors({}); // Clear errors
        }
    };

    // Handle cancel
    const handleCancel = () => {
        setIsModalOpen(false);
        setFormData({});
        setErrors({});
        setTouched(false); // Reset the touched state
    };

    // Run form validation whenever formData changes
    useEffect(() => {
        validateForm(formData); // Validate whenever formData changes
    }, [formData]);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="m-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
                {`New ${title}`}
            </button>
            <Modal isOpen={isModalOpen} onClose={handleCancel}>
                <h2 className="text-xl font-bold mb-4">{`Create ${title}`}</h2>
                <form onSubmit={handleSubmit}>
                    {fields.map((field) => (
                        <div key={field.name} className="mb-4">
                            <label htmlFor={field.name} className="block text-gray-700 mb-2">
                                {field.label}
                            </label>

                            {field.type === "select" ? (
                                <select
                                    id={field.name}
                                    name={field.name}
                                    value={formData[field.name] || ""}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded ${touched && errors[field.name] ? "border-red-500" : "border-gray-300"
                                        }`}
                                >
                                    <option value="Select">Select {field.label}</option>
                                    {field.options.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    id={field.name}
                                    type={field.type}
                                    name={field.name}
                                    value={formData[field.name] || ""}
                                    onChange={handleChange}
                                    placeholder={field.placeholder}
                                    className={`w-full px-3 py-2 border rounded ${touched && errors[field.name] ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                            )}

                            {touched && errors[field.name] && (
                                <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                            )}
                        </div>
                    ))}

                    <div className="flex justify-end gap-4 mt-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 bg-black text-white rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`flex items-center px-4 py-2 rounded ${isFormValid ? "bg-green-500 text-white" : "bg-gray-400 text-gray-200 cursor-not-allowed"
                                }`}
                            disabled={!isFormValid} // Disable button if form is invalid
                        >
                            Create
                            <span className="ml-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-3.293-3.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </span>
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

AddItemButtonWithModal.propTypes = {
    title: PropTypes.string.isRequired,
    fields: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            placeholder: PropTypes.string,
            required: PropTypes.bool,
            options: PropTypes.arrayOf(
                PropTypes.shape({
                    value: PropTypes.string.isRequired,
                    label: PropTypes.string.isRequired,
                })
            ),
        })
    ).isRequired,
    onSubmit: PropTypes.func.isRequired,
};

export default AddItemButtonWithModal;
