import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSales, editSale, deleteSale, addSale } from "../features/saleSlice";
import { fetchCustomers } from "../features/customerSlice";
import { fetchProducts } from "../features/productSlice";
import { fetchStores } from "../features/storeSlice"; // Assuming you have a store slice
import AddItemButtonWithModal from "../components/AddItemButtonWithModal";
import Table from "../components/Table";
import EditRowForm from "../components/EditRowForm";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import Footer from "../components/Footer";
import Pagination from "../components/Pagination";

const SalePage = () => {
    const dispatch = useDispatch();
    const { sales, loading, error } = useSelector((state) => state.sales);
    const { customers } = useSelector((state) => state.customers);
    const { products } = useSelector((state) => state.products);
    const { stores } = useSelector((state) => state.stores);

    const [editRow, setEditRow] = useState(null);
    const [deleteRow, setDeleteRow] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const keyMapping = {
        Id: "id",
        Customer: "customerName",
        Product: "productName",
        Store: "storeName",
        "Date Sold": "dateSold",
    };

    const columns = ["Id", "Customer", "Product", "Store", "Date Sold", "Actions", "Actions"];

    // Fetch necessary data
    useEffect(() => {
        dispatch(fetchSales());
        dispatch(fetchCustomers());
        dispatch(fetchProducts());
        dispatch(fetchStores());
    }, [dispatch]);

    // Map sales to include names from customers, products, and stores
    const mappedSales = sales.map((sale) => {
        const customer = customers.find((c) => c.id === sale.customerId);
        const product = products.find((p) => p.id === sale.productId);
        const store = stores.find((s) => s.id === sale.storeId);

        return {
            ...sale,
            customerName: customer ? customer.name : "N/A",
            productName: product ? product.name : "N/A",
            storeName: store ? store.name : "N/A",
        };
    });

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

    const totalPages = Math.ceil(mappedSales.length / itemsPerPage);
    const currentSales = mappedSales.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-grow">
                <AddItemButtonWithModal
                    title="Sale"
                    fields={[
                        {
                            name: "customerId",
                            label: "Customer",
                            type: "select",
                            options: customers.map((c) => ({ value: c.id, label: c.name })) || [],
                        },
                        {
                            name: "productId",
                            label: "Product",
                            type: "select",
                            options: products.map((p) => ({ value: p.id, label: p.name })) || [],
                        },
                        {
                            name: "storeId",
                            label: "Store",
                            type: "select",
                            options: stores.map((s) => ({ value: s.id, label: s.name })) || [],
                        },
                        {
                            name: "dateSold",
                            label: "Date Sold",
                            type: "date",
                            required: true,
                        },
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
