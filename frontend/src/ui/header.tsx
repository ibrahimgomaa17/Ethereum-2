import { Button } from "@/components/ui/button";
import { GalleryVerticalEnd } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
    token?: string;
    user?: string;
    onLogout?: () => void;
}

export function Header({ token, user, onLogout }: HeaderProps) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between px-6 py-4">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                            <GalleryVerticalEnd className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-white">
                                BlockChain
                            </span>
                            <span className="text-xs text-white/80">
                                Asset Management
                            </span>
                        </div>
                    </Link>

                    <nav className="flex items-center gap-4">
                        {token && user ? (
                            <>
                                <Link to="/admin">
                                    <Button 
                                        variant="ghost" 
                                        className="text-white hover:bg-white/10 hover:text-white"
                                    >
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button 
                                    variant="ghost" 
                                    onClick={onLogout}
                                    className="text-white hover:bg-white/10 hover:text-white"
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Link to="/login">
                                <Button 
                                    variant="ghost"
                                    className="text-white hover:bg-white/10 hover:text-white"
                                >
                                    Login
                                </Button>
                            </Link>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}