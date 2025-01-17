import PropTypes from "prop-types";
import Modal from "./Modal";

const EditRowForm = ({ isOpen, onCancel, row, onSave, onChange, fields,title }) => {
    const handleSave = (e) => {
        e.preventDefault();
        onSave(row); // Save the updated row
    };

    return (
        <Modal isOpen={isOpen} onClose={onCancel}>
            <div className="p-4">
                <h2 className="text-2xl font-bold mb-6">Edit {title}</h2>
                <form onSubmit={handleSave}>
                    {fields.map((field) => (
                        <div key={field.name} className="mb-4">
                            <label
                                htmlFor={field.name}
                                className="block text-gray-700 mb-2"
                            >
                                {field.label || field.name}
                            </label>
                            <input
                                id={field.name}
                                type={field.type || "text"}
                                value={row[field.name] || ""}
                                onChange={(e) =>
                                    onChange({ ...row, [field.name]: e.target.value })
                                }
                                placeholder={field.placeholder || `Enter ${field.name}`}
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                required={field.required || false}
                            />
                        </div>
                    ))}

                    <div className="flex justify-end gap-4 mt-6">
                        {/* Cancel Button */}
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 bg-black text-white rounded"
                        >
                            Cancel
                        </button>
                        {/* Save Button */}
                        <button
                            type="submit"
                            className="flex items-center px-4 py-2 bg-green-500 text-white rounded"
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
    isOpen: PropTypes.bool.isRequired, // Controls modal visibility
    onCancel: PropTypes.func.isRequired, // Function to close the modal
    row: PropTypes.object.isRequired, // Accepts a generic row object
    onSave: PropTypes.func.isRequired, // Save callback
    onChange: PropTypes.func.isRequired, // Change handler
    fields: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired, // Name of the field in the object
            type: PropTypes.string, // Input type (e.g., text, number, etc.)
            placeholder: PropTypes.string, // Placeholder text for the input
            label: PropTypes.string, // Label for the input
            required: PropTypes.bool, // Whether the field is required
        })
    ).isRequired, title: PropTypes.string, // The title to display in the form
};

export default EditRowForm;
