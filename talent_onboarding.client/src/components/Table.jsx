import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const Table = ({ columns, data, keyMapping, onEdit, onDelete }) => {
    if (!Array.isArray(data)) {
        console.error("Table: `data` prop must be an array", data);
        return <p>Invalid data provided to Table component.</p>;
    }

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(); // Customize this format as needed
    };

    return (
        <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
                <tr>
                    {columns.map((col, index) => (
                        <th key={index} className="border border-gray-300 px-4 py-2 text-left">
                            {col}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                        {columns.slice(0, -2).map((col) => {
                            const field = keyMapping[col];
                            console.log('Row Data:', row); // Log the row data for debugging
                            return (
                                <td key={col} className="border border-gray-300 px-4 py-2">
                                    {field && col === "Date Sold"
                                        ? formatDate(row[field]) // Format date separately
                                        : row[field] || "N/A"}
                                </td>
                            );
                        })}
                        <td className="border border-gray-300 px-4 py-2">
                            <button
                                onClick={() => onEdit(row)}
                                className="flex items-center justify-center px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                                title="Edit"
                            >
                                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                Edit
                            </button>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                            <button
                                onClick={() => onDelete(row.id)}
                                className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                title="Delete"
                            >
                                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};


Table.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.string).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    keyMapping: PropTypes.objectOf(PropTypes.string).isRequired,

};

export default Table;