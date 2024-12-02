
import PropTypes from "prop-types";

const EditRowForm = ({ row, onSave, onCancel, onChange, fields }) => {
    return (
        <div className="mb-4">
            <h2 className="text-xl font-semibold">Edit Details</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onSave(row); // Call onSave with the updated row
                }}
            >
                {fields.map((field) => (
                    <input
                        key={field.name}
                        type={field.type || "text"}
                        value={row[field.name] || ""}
                        onChange={(e) =>
                            onChange({ ...row, [field.name]: e.target.value })
                        }
                        className="border p-2 mb-2 w-full"
                        placeholder={field.placeholder || field.name}
                    />
                ))}
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Save
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
                >
                    Cancel
                </button>
            </form>
        </div>
    );
};

EditRowForm.propTypes = {
    row: PropTypes.object.isRequired, // Accepts a generic row object
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    fields: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired, // Name of the field in the object
            type: PropTypes.string, // Input type (e.g., text, number, etc.)
            placeholder: PropTypes.string, // Placeholder text for the input
        })
    ).isRequired,
};

export default EditRowForm;

