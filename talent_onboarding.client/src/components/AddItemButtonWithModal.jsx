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

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="m-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
                {`Add ${title}`}
            </button>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="text-xl font-bold mb-4">{`Add ${title}`}</h2>
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
                    <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
                        Add
                    </button>
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
