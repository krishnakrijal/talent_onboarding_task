
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import CompanyDescription from "./components/CompanyDescription";
import CustomerPage from "./pages/CustomerPage";
import ProductPage from "./pages/ProductPage";
import SalesPage from "./pages/SalesPage";
import StorePage from "./pages/StorePage";

const App = () => {
    return (
        <div>
            <NavBar />
           
            <Routes>
                <Route path="/customers" element={<CustomerPage />} />
                <Route path="/products" element={<ProductPage />} />
                <Route path="/sales" element={<SalesPage />} />
                <Route path="/stores" element={<StorePage />} />
                <Route path="/" element={< CompanyDescription />} />
            </Routes>
        </div>
    );
};

export default App;
