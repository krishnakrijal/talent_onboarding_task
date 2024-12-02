
import { NavLink } from "react-router-dom";

const NavBar = () => {
    const linkClass = "px-4 py-2 text-white hover:text-blue-500";

    return (
        <nav className="bg-slate-900 text-white shadow-md">
            <div className="container mx-auto flex justify-between py-2">
                <div className="flex space-x-4">
                    <NavLink to="/" className={linkClass}>
                        React
                    </NavLink>
                    <NavLink to="/customers" className={linkClass}>
                        Customers
                    </NavLink>
                    <NavLink to="/products" className={linkClass}>
                        Products
                    </NavLink>
                    <NavLink to="/sales" className={linkClass}>
                        Sales
                    </NavLink>
                    <NavLink to="/stores" className={linkClass}>
                        Stores
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;

