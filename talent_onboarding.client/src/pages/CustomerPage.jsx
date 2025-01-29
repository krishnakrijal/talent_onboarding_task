import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers, editCustomer, deleteCustomer, addCustomer } from "../features/customerSlice";
import AddItemButtonWithModal from "../components/AddItemButtonWithModal";
import Table from "../components/Table";
import EditRowForm from "../components/EditRowForm";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination";

const CustomerPage = () => {
    const dispatch = useDispatch();
    const { customers, loading, error } = useSelector((state) => state.customers);

    const [editRow, setEditRow] = useState(null);
    const [deleteRow, setDeleteRow] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const keyMapping = {
        Id: "id",
        Name: "name",
        Address: "address",
    };

    const columns = ["Id", "Name", "Address", "Actions", "Actions"];

    useEffect(() => {
        dispatch(fetchCustomers());
    }, [dispatch]);

    const handleEdit = (row) => {
        setEditRow(row);
    };

    const saveEdit = (updatedRow) => {
        dispatch(editCustomer(updatedRow));
        setEditRow(null);
    };

    const cancelEdit = () => {
        setEditRow(null);
    };

    const handleAddCustomer = (data) => {
        dispatch(addCustomer(data));
    };

    const handleDelete = (id) => {
        setDeleteRow(id);
    };

    const confirmDelete = () => {
        if (deleteRow) {
            dispatch(deleteCustomer(deleteRow));
            setDeleteRow(null);
        }
    };

    const cancelDelete = () => {
        setDeleteRow(null);
    };

    const totalPages = Math.ceil(customers.length / itemsPerPage);
    const currentCustomers = customers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-grow">
                <AddItemButtonWithModal
                    title="Customer"
                    fields={[
                        { name: "name", label: "Name", type: "text", placeholder: "Enter customer name", required: true },
                        { name: "address", label: "Address", type: "text", placeholder: "Enter address", required: true },
                    ]}
                    onSubmit={handleAddCustomer}
                />
                {editRow && (
                    <EditRowForm
                        isOpen={true}
                        title="Customer"
                        row={editRow}
                        onSave={saveEdit}
                        onCancel={cancelEdit}
                        onChange={setEditRow}
                        fields={[
                            { name: "name", placeholder: "Customer Name" },
                            { name: "address", placeholder: "Address" },
                        ]}
                    />
                )}
                {deleteRow && (
                    <DeleteConfirmationModal
                        isOpen={true}
                        name="Customer"
                        message="Are you sure?"
                        onDelete={confirmDelete}
                        onClose={cancelDelete}
                    />
                )}
                <Table
                    columns={columns}
                    data={currentCustomers || []}
                    keyMapping={keyMapping}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
            <Footer />
        </div>
    );
};

export default CustomerPage;

