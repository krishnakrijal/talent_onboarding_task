import PropTypes from "prop-types";

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-md w-1/3">
                <button className="absolute top-2 right-2 text-gray-600" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
};

// PropTypes for validation
Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired, // Whether the modal is open
    onClose: PropTypes.func.isRequired, // Function to handle modal close
    children: PropTypes.node.isRequired, // Modal content
};
export default Modal;
