import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSales, editSale, deleteSale, addSale } from "../features/saleSlice";
import AddItemButtonWithModal from "../components/AddItemButtonWithModal";
import Table from "../components/Table";
import EditRowForm from "../components/EditRowForm";

const SalePage = () => {
    const dispatch = useDispatch();
    const { sales, loading, error } = useSelector((state) => state.sales);

    const [editRow, setEditRow] = useState(null); // Track the row being edited

    const keyMapping = {
        Id: "id",
        Customer: "customerName",
        Product: "productName",
        Store: "storeName",
        "Date Sold": "dateSold",
    };

    const columns = ["Id", "Customer", "Product", "Store", "Date Sold", "Actions", "Actions"];

    useEffect(() => {
        dispatch(fetchSales());
    }, [dispatch]);

    const handleEdit = (row) => {
        setEditRow(row); // Set the row to edit
    };

    const saveEdit = (updatedRow) => {
        dispatch(editSale(updatedRow)); // Dispatch edit action to Redux
        setEditRow(null); // Exit edit mode
    };

    const cancelEdit = () => {
        setEditRow(null); // Exit edit mode without saving
    };

    const handleAddSale = (data) => {
        console.log("New Sale:", data);
        dispatch(addSale(data));
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this sale?")) {
            dispatch(deleteSale(id));
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <AddItemButtonWithModal
                title="Sale"
                fields={[
                    { name: "customerId", label: "Customer ID", type: "number", placeholder: "Enter customer ID", required: true },
                    { name: "productId", label: "Product ID", type: "number", placeholder: "Enter product ID", required: true },
                    { name: "storeId", label: "Store ID", type: "number", placeholder: "Enter store ID", required: true },
                    { name: "dateSold", label: "Date Sold", type: "date", required: true },
                ]}
                onSubmit={handleAddSale}
            />
            {editRow ? (
                <EditRowForm
                    row={editRow}
                    onSave={saveEdit}
                    onCancel={cancelEdit}
                    onChange={setEditRow}
                    fields={[
                        { name: "customerId", placeholder: "Customer ID" },
                        { name: "productId", placeholder: "Product ID" },
                        { name: "storeId", placeholder: "Store ID" },
                        { name: "dateSold", placeholder: "Date Sold" },
                    ]}
                />
            ) : (
                <Table
                    columns={columns}
                    data={sales || []} // Ensure `sales` is always an array
                    keyMapping={keyMapping}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
};

export default SalePage;
