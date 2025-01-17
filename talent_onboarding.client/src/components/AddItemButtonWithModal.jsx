import { useState } from "react";
import PropTypes from "prop-types";
import Modal from "./Modal";

const AddItemButtonWithModal = ({ title, fields, onSubmit }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setIsModalOpen(false); // Close the modal after submission
        setFormData({}); // Reset form data
    };

    const handleCancel = () => {
        setIsModalOpen(false); // Close the modal
        setFormData({}); // Reset form data
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className=" m-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
                {`New ${title}`}
            </button>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="text-xl font-bold mb-4">{`Create ${title}`}</h2>
                <form onSubmit={handleSubmit}>
                    {fields.map((field) => (
                        <div key={field.name} className="mb-4">
                            <label className="block text-gray-700">{field.label}</label>
                            <input
                                type={field.type}
                                name={field.name}
                                value={formData[field.name] || ""}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                required={field.required}
                            />
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
                            className="flex items-center px-4 py-2 bg-green-500 text-white rounded"
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

// PropTypes for validation
AddItemButtonWithModal.propTypes = {
    title: PropTypes.string.isRequired, // Title of the modal (e.g., "Customer")
    fields: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired, // Field name (e.g., "name")
            label: PropTypes.string.isRequired, // Field label (e.g., "Name")
            type: PropTypes.string.isRequired, // Input type (e.g., "text", "number")
            placeholder: PropTypes.string, // Placeholder text
            required: PropTypes.bool, // Whether the field is required
        })
    ).isRequired,
    onSubmit: PropTypes.func.isRequired, // Function to handle form submission
};

export default AddItemButtonWithModal;

