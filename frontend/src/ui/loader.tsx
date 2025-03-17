// components/Loader.tsx
import { Loader } from "lucide-react"; // Example: Using lucide-react for a spinner

export const LoaderComponent = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/70 z-50">
      <Loader className="animate-spin h-12 w-12 text-black" /> {/* Example spinner */}
    </div>
  );
};