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
import { format, parse } from "date-fns"; // Import date-fns for formatting

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
            dateSold: sale.dateSold ? format(new Date(sale.dateSold), 'MM/dd/yyyy') : "N/A", // Format dateSold
        };
    });

    const handleEdit = (row) => {
        setEditRow(row);
    };

    const saveEdit = (updatedRow) => {
        // Parse dateSold back to Date object before dispatching the update
        const parsedDate = parse(updatedRow.dateSold, 'MM/dd/yyyy', new Date());
        dispatch(editSale({ ...updatedRow, dateSold: parsedDate }));
        setEditRow(null);
    };

    const cancelEdit = () => {
        setEditRow(null);
    };

    const handleAddSale = (data) => {
        // Parse dateSold to Date object before dispatching the add
        const parsedDate = parse(data.dateSold, 'MM/dd/yyyy', new Date());
        dispatch(addSale({ ...data, dateSold: parsedDate }));
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
                            name: "dateSold",
                            label: "Date Sold",
                            type: "text", // Use text type to format date as MM/DD/YYYY
                            value: format(new Date(), 'MM/dd/yyyy'), // Default to today's date
                            placeholder: "mm/dd/yyyy",
                            required: true,
                        },
                        {
                            name: "customerId",
                            label: "Customer",
                            type: "select",
                            options: customers.map((c) => ({ value: String(c.id), label: c.name })) || [],
                        },
                        {
                            name: "productId",
                            label: "Product",
                            type: "select",
                            options: products.map((p) => ({ value: String(p.id), label: p.name })) || [],
                        },
                        {
                            name: "storeId",
                            label: "Store",
                            type: "select",
                            options: stores.map((s) => ({ value: String(s.id), label: s.name })) || [],
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
                            {
                                name: "dateSold",
                                label: "Date Sold",
                                type: "text", // Use text to accept MM/DD/YYYY format
                                value: editRow.dateSold ? format(new Date(editRow.dateSold), 'MM/dd/yyyy') : '',
                                placeholder: "mm/dd/yyyy",
                                required: true,
                            },
                            {
                                name: "customerId",
                                label: "Customer",
                                type: "select",
                                options: customers.map((c) => ({ value: String(c.id), label: c.name })) || [],
                            },
                            {
                                name: "productId",
                                label: "Product",
                                type: "select",
                                options: products.map((p) => ({ value: String(p.id), label: p.name })) || [],
                            },
                            {
                                name: "storeId",
                                label: "Store",
                                type: "select",
                                options: stores.map((s) => ({ value: String(s.id), label: s.name })) || [],
                            },
                           
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
