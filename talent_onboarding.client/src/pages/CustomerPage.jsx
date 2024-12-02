import  { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers,editCustomer,deleteCustomer,addCustomer } from "../features/customerSlice";
import AddItemButtonWithModal from "../components/AddItemButtonWithModal";
import Table from "../components/Table";
import EditRowForm from "../components/EditRowForm";

const CustomerPage = () => {
    const dispatch = useDispatch();
    const { customers, loading, error } = useSelector((state) => state.customers);

    const [editRow, setEditRow] = useState(null); // Track the row being edited

    const keyMapping = {
        Id: "id",
        Name: "name",
        Address: "address"
    };

    const columns = ["Id", "Name", "Address", "Actions", "Actions"];
  
    useEffect(() => {
        dispatch(fetchCustomers());
    }, [dispatch]);

    const handleEdit = (row) => {
        setEditRow(row); // Set the row to edit
    };

    const saveEdit = (updatedRow) => {
        dispatch(editCustomer(updatedRow)); // Dispatch edit action to Redux
        setEditRow(null); // Exit edit mode
    };

    const cancelEdit = () => {
        setEditRow(null); // Exit edit mode without saving
    };

    const handleAddCustomer = (data) => {
        console.log("New Customer:", data);
        // Dispatch an action or call API to add the customer
        dispatch(addCustomer(data));
    };


    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            dispatch(deleteCustomer(id));
        }
    };

    console.log("Customers:", customers); // Debug customers


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <AddItemButtonWithModal
                title="Customer"
                fields={[
                    { name: "name", label: "Name", type: "text", placeholder: "Enter customer name", required: true },
                    { name: "address", label: "Address", type: "text", placeholder: "Enter address", required: true },
                ]}
                onSubmit={handleAddCustomer}
            />
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {editRow ? (<EditRowForm  row={editRow}
                                      onSave={saveEdit}
                                      onCancel={cancelEdit}
                                      onChange={setEditRow}
                                      fields={[
                                               { name: "name", placeholder: "Customer Name" },
                                               { name: "address", placeholder: "Customer Address" },
                                              ]}                                   
                       />) :

                <Table
                    columns={columns}
                    data={customers || []} // Ensure `customers` is always an array
                    keyMapping={ keyMapping  }
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />}
        </div>
    );
};

export default CustomerPage;
