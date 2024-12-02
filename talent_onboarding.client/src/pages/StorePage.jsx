import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStores, editStore, deleteStore, addStore } from "../features/storeSlice";
import AddItemButtonWithModal from "../components/AddItemButtonWithModal";
import Table from "../components/Table";
import EditRowForm from "../components/EditRowForm";

const StorePage = () => {
    const dispatch = useDispatch();
    const { stores, loading, error } = useSelector((state) => state.stores);

    const [editRow, setEditRow] = useState(null); // Track the row being edited

    const keyMapping = {
        Id: "id",
        Name: "name",
        Address: "address",
    };

    const columns = ["Id", "Name", "Address", "Actions", "Actions"];

    useEffect(() => {
        dispatch(fetchStores());
    }, [dispatch]);

    const handleEdit = (row) => {
        setEditRow(row); // Set the row to edit
    };

    const saveEdit = (updatedRow) => {
        dispatch(editStore(updatedRow)); // Dispatch edit action to Redux
        setEditRow(null); // Exit edit mode
    };

    const cancelEdit = () => {
        setEditRow(null); // Exit edit mode without saving
    };

    const handleAddStore = (data) => {
        console.log("New Store:", data);
        dispatch(addStore(data));
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this store?")) {
            dispatch(deleteStore(id));
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <AddItemButtonWithModal
                title="Store"
                fields={[
                    { name: "name", label: "Name", type: "text", placeholder: "Enter store name", required: true },
                    { name: "address", label: "Address", type: "text", placeholder: "Enter Address", required: true },
                ]}
                onSubmit={handleAddStore}
            />
            {editRow ? (
                <EditRowForm
                    row={editRow}
                    onSave={saveEdit}
                    onCancel={cancelEdit}
                    onChange={setEditRow}
                    fields={[
                        { name: "name", placeholder: "Store Name" },
                        { name: "address", placeholder: "Address" },
                    ]}
                />
            ) : (
                <Table
                    columns={columns}
                    data={stores || []} // Ensure `stores` is always an array
                    keyMapping={keyMapping}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
};

export default StorePage;
