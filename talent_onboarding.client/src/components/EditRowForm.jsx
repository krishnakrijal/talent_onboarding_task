import PropTypes from "prop-types";
import Modal from "./Modal";
import { useState } from "react";

const EditRowForm = ({ isOpen, onCancel, row, onSave, onChange, fields, title }) => {
    const [errors, setErrors] = useState({});

    const handleSave = (e) => {
        e.preventDefault();
        let validationErrors = {};

        fields.forEach((field) => {
            if (field.required && (!row[field.name] || row[field.name].trim() === "")) {
                validationErrors[field.name] = "This field cannot be empty or just spaces.";
            }
        });

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        onSave(row); // Save the updated row
    };

    return (
        <Modal isOpen={isOpen} onClose={onCancel}>
            <div className="p-4">
                <h2 className="text-2xl font-bold mb-6">Edit {title}</h2>
                <form onSubmit={handleSave}>
                    {fields.map((field) => (
                        <div key={field.name} className="mb-4">
                            <label htmlFor={field.name} className="block text-gray-700 mb-2">
                                {field.label || field.name}
                            </label>

                            {field.type === "select" ? (
                                <select
                                    id={field.name}
                                    value={row[field.name] || ""}
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        onChange({ ...row, [field.name]: newValue });
                                        setErrors((prevErrors) => ({
                                            ...prevErrors,
                                            [field.name]: newValue.trim() === "" ? "This field cannot be empty." : "",
                                        }));
                                    }}
                                    className={`w-full px-3 py-2 border rounded ${errors[field.name] ? "border-red-500" : "border-gray-300"
                                        }`}
                                >
                                    <option value="">Select {field.label}</option>
                                    {field.options.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    id={field.name}
                                    type={field.type || "text"}
                                    value={row[field.name] || ""}
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        onChange({ ...row, [field.name]: newValue });
                                        setErrors((prevErrors) => ({
                                            ...prevErrors,
                                            [field.name]: newValue.trim() === "" ? "This field cannot be empty or just spaces." : "",
                                        }));
                                    }}
                                    placeholder={field.placeholder || `Enter ${field.name}`}
                                    className={`w-full px-3 py-2 border rounded ${errors[field.name] ? "border-red-500" : "border-gray-300"
                                        }`}
                                    required={field.required || false}
                                />
                            )}

                            {errors[field.name] && (
                                <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                            )}
                        </div>
                    ))}


                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 bg-black text-white rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
                            disabled={Object.values(errors).some(error => error !== "")}
                        >
                            Edit
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
            </div>
        </Modal>
    );
};

EditRowForm.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    row: PropTypes.object.isRequired,
    onSave: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    fields: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            type: PropTypes.string,
            placeholder: PropTypes.string,
            label: PropTypes.string,
            required: PropTypes.bool,
        })
    ).isRequired,
    title: PropTypes.string,
};

export default EditRowForm;