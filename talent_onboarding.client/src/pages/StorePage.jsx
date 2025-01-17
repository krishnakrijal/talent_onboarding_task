import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStores, editStore, deleteStore, addStore } from "../features/storeSlice";
import AddItemButtonWithModal from "../components/AddItemButtonWithModal";
import Table from "../components/Table";
import EditRowForm from "../components/EditRowForm";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination"; // Import Pagination component

const StorePage = () => {
    const dispatch = useDispatch();
    const { stores, loading, error } = useSelector((state) => state.stores);

    const [editRow, setEditRow] = useState(null);
    const [deleteRow, setDeleteRow] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5); // Items per page

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
        setEditRow(row);
    };

    const saveEdit = (updatedRow) => {
        dispatch(editStore(updatedRow));
        setEditRow(null);
    };

    const cancelEdit = () => {
        setEditRow(null);
    };

    const handleAddStore = (data) => {
        dispatch(addStore(data));
    };

    const handleDelete = (id) => {
        setDeleteRow(id);
    };

    const confirmDelete = () => {
        if (deleteRow) {
            dispatch(deleteStore(deleteRow));
            setDeleteRow(null);
        }
    };

    const cancelDelete = () => {
        setDeleteRow(null);
    };

    // Pagination Logic
    const totalPages = Math.ceil(stores.length / itemsPerPage);
    const currentStores = stores.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-grow">
                <AddItemButtonWithModal
                    title="Store"
                    fields={[
                        { name: "name", label: "Name", type: "text", placeholder: "Enter store name", required: true },
                        { name: "address", label: "Address", type: "text", placeholder: "Enter Address", required: true },
                    ]}
                    onSubmit={handleAddStore}
                />
                {editRow && (
                    <EditRowForm
                        isOpen={true}
                        title="Store"
                        row={editRow}
                        onSave={saveEdit}
                        onCancel={cancelEdit}
                        onChange={setEditRow}
                        fields={[
                            { name: "name", placeholder: "Store Name" },
                            { name: "address", placeholder: "Address" },
                        ]}
                    />
                )}
                {deleteRow && (
                    <DeleteConfirmationModal
                        isOpen={true}
                        name="Store"
                        message="Are you sure?"
                        onDelete={confirmDelete}
                        onClose={cancelDelete}
                    />
                )}
                <Table
                    columns={columns}
                    data={currentStores || []}
                    keyMapping={keyMapping}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />

            </div>
            <Footer />
        </div>
    );
};

export default StorePage;
