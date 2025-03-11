import { Button } from "@/components/ui/button";
import { GalleryVerticalEnd } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
    return (

        <div className="flex gap-2 justify-between fixed top-0 w-screen px-5 py-4">
            <a href="#" className="flex items-center gap-2 font-medium">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <GalleryVerticalEnd className="size-4" />
                </div>
                Acme Inc.
            </a>
            <Link to="/login">
                <Button variant="outline">Login</Button>
            </Link>

        </div>

    );
}