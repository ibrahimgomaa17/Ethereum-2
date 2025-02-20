import { Link } from "react-router-dom";

const Header = ({
    token,
    user,
    onLogout,
}: {
    token: string | null;
    user: any;
    onLogout: () => void;
}) => {
    return (
        <header className="bg-gray-900 text-white py-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center px-6">
                {/* Logo or Brand */}
                <Link to="/" className="text-xl font-semibold text-blue-400 hover:text-blue-300">
                    Blockchain Registry
                </Link>

                {/* Navigation Links */}
                <nav className="flex items-center space-x-6">
                    {token ? (
                        <>
                            <span className="text-gray-300">
                                Welcome, <span className="font-semibold">{user?.userId}</span>
                            </span>
                            <button
                                onClick={onLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all" >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all"
                        >
                            Login
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
