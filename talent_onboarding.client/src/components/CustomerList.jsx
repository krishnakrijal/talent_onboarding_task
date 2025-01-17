import PropTypes from 'prop-types';

const CustomerList = ({ customers, onDelete }) => (
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Address</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {customers.map((customer) => (
                <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td>{customer.name}</td>
                    <td>{customer.address}</td>
                    <td>
                        <button onClick={() => onDelete(customer.id)}>Delete</button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

// Define prop types
CustomerList.propTypes = {
    customers: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            address: PropTypes.string.isRequired,
        })
    ).isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default CustomerList;
