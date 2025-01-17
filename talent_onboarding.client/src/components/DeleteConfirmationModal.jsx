import PropTypes from "prop-types";
import Modal from "./Modal"; // Import your existing Modal component

const DeleteConfirmationModal = ({ isOpen, onClose, onDelete, name }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                {/* Modal Title */}
                <h2 className="text-2xl font-bold mb-4">{`Delete ${name}`}</h2>

                {/* Confirmation Text */}
                <p className="text-gray-700 mb-6">Are you sure?</p>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4">
                    {/* Cancel Button */}
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-black text-white rounded"
                    >
                        Cancel
                    </button>

                    {/* Delete Button */}
                    <button
                        onClick={onDelete}
                        className="flex items-center px-4 py-2 bg-red-500 text-white rounded"
                    >
                        Delete
                        <span className="ml-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </span>
                    </button>
                </div>
            </div>
        </Modal>
    );
};

DeleteConfirmationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired, // Controls modal visibility
    onClose: PropTypes.func.isRequired, // Function to close the modal
    onDelete: PropTypes.func.isRequired, // Function to handle the delete action
    name: PropTypes.string.isRequired, // Name of the item being deleted
};

export default DeleteConfirmationModal;
