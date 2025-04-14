import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GalleryVerticalEnd } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
  token?: string;
  user?: string;
  onLogout?: () => void;
}

export function Header({ token, user, onLogout }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 ${
        isScrolled ? "bg-gray-900/90 backdrop-blur-md" : "bg-gray-900"
      } transition-all duration-300 shadow-sm`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand Section */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center gap-3 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 group-hover:from-purple-700 group-hover:to-indigo-700 transition-colors shadow-md">
                <GalleryVerticalEnd className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col ml-2">
                <span className="text-lg font-bold text-white">
                  Blockchain
                </span>
                <span className="text-xs text-gray-300">
                  Asset Management
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-4">
            {token && user ? (
              <>
                <Link to="/admin">
                  <Button
                    variant="ghost"
                    className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={onLogout}
                  variant="ghost"
                  className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button
                  variant="outline"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-all transform hover:scale-[1.02]"
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