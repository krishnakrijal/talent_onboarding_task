import PropTypes from "prop-types";
import { useState } from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const [selectedPage, setSelectedPage] = useState(currentPage);

    // Handle page change
    const handlePageChange = (page) => {
        onPageChange(page);
        setSelectedPage(page);
    };

    return (
        <div className="flex justify-between items-center py-4">
            {/* Left Side - Select Page */}
            <div>
                <select
                    value={selectedPage}
                    onChange={(e) => handlePageChange(Number(e.target.value))}
                    className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded"
                >
                    {Array.from({ length: totalPages }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                            {i + 1}
                        </option>
                    ))}
                </select>
            </div>

            {/* Right Side - Current Page */}
            <div className="flex items-center space-x-2 bg-sky-500 text-white py-2 px-4 rounded-lg shadow-md">
                <span className="text-sm">{currentPage}</span>
            </div>
        </div>
    );
};

// Define PropTypes
Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired, // Current active page
    totalPages: PropTypes.number.isRequired,  // Total number of pages
    onPageChange: PropTypes.func.isRequired,  // Callback for page change
};

export default Pagination;
