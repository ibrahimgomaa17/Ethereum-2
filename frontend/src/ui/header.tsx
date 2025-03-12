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

        <div className="flex gap-2 justify-between fixed top-0 w-screen px-5 py-4">
            <Link to="/" className="flex flex-row items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <GalleryVerticalEnd className="size-4" />
                </div>
                Acme Inc.
            </Link>

            {token && user ? (
                <Button variant="outline" onClick={onLogout}>Logout</Button>
            ) : (
                <Link to="/login">
                    <Button variant="outline">Login</Button>
                </Link>
            )}

        </div>

    );
}