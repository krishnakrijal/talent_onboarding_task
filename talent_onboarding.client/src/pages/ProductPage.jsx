import { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, editProduct, deleteProduct, addProduct } from "../features/productSlice";
import Table from "../components/Table";
import AddItemButtonWithModal from "../components/AddItemButtonWithModal";
import EditRowForm from "../components/EditRowForm";


const ProductPage = () => {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);

    const [editRow, setEditRow] = useState(null); // Track the row being edited

    const keyMapping = {
        Id: "id",
        Name: "name",
       Price: "price"
    };




    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleEdit = (row) => {
        setEditRow(row); // Set the row to edit
    };

    const saveEdit = (updatedRow) => {
        dispatch(editProduct(updatedRow)); // Dispatch edit action to Redux
        setEditRow(null); // Exit edit mode
    };

    const cancelEdit = () => {
        setEditRow(null); // Exit edit mode without saving
    };

    const handleAddProduct = (data) => {
        console.log("New Product:", data);
        // Dispatch an action or call API to add the customer
        dispatch(addProduct(data));
    };


    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            dispatch(deleteProduct(id));
        }
    };




    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;


    return (
        <div >
            <AddItemButtonWithModal
                title="Product"
                fields={[
                    { name: "name", label: "Name", type: "text", placeholder: "Enter product name", required: true },
                    { name: "price", label: "Price", type: "number", placeholder: "Enter price", required: true },
                ]}
                onSubmit={handleAddProduct}
            />
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {editRow ? (<EditRowForm row={editRow}
                onSave={saveEdit}
                onCancel={cancelEdit}
                onChange={setEditRow}
                fields={[
                    { name: "productName", placeholder: "Product Name" },
                    { name: "price", type: "number", placeholder: "Price" },
                ]}
            />) :
                <Table
                    columns={["id", "name", "price","Actions","Actions"]}
                    data={products || []}
                    keyMapping={keyMapping}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />}
        </div>
    );
};

export default ProductPage;
