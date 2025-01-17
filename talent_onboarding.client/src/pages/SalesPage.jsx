import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSales, editSale, deleteSale, addSale } from "../features/saleSlice";
import AddItemButtonWithModal from "../components/AddItemButtonWithModal";
import Table from "../components/Table";
import EditRowForm from "../components/EditRowForm";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination";

const SalePage = () => {
    const dispatch = useDispatch();
    const { sales, loading, error } = useSelector((state) => state.sales);

    const [editRow, setEditRow] = useState(null);
    const [deleteRow, setDeleteRow] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

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
        setEditRow(row);
    };

    const saveEdit = (updatedRow) => {
        dispatch(editSale(updatedRow));
        setEditRow(null);
    };

    const cancelEdit = () => {
        setEditRow(null);
    };

    const handleAddSale = (data) => {
        dispatch(addSale(data));
    };

    const handleDelete = (id) => {
        setDeleteRow(id);
    };

    const confirmDelete = () => {
        if (deleteRow) {
            dispatch(deleteSale(deleteRow));
            setDeleteRow(null);
        }
    };

    const cancelDelete = () => {
        setDeleteRow(null);
    };

    const totalPages = Math.ceil(sales.length / itemsPerPage);
    const currentSales = sales.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-grow">
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
                {editRow && (
                    <EditRowForm
                        isOpen={true}
                        title="Sale"
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
                )}
                {deleteRow && (
                    <DeleteConfirmationModal
                        isOpen={true}
                        name="Sale"
                        message="Are you sure?"
                        onDelete={confirmDelete}
                        onClose={cancelDelete}
                    />
                )}
                <Table
                    columns={columns}
                    data={currentSales || []}
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

export default SalePage;
