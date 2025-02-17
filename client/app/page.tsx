"use client";

import { useState } from "react";

interface Property {
    name: string;
    propertyType: string;
    serialNumber: string;
    location?: string;
    owner: string;
}

export default function Home() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!searchTerm) return;
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`/api/property/name/${searchTerm}`);
            if (!res.ok) throw new Error("Property not found");

            const data: Property = await res.json();
            setProperty(data);
        } catch (err: any) {
            setError(err.message);
            setProperty(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-4">🔍 Blockchain Property Search</h1>
            
            <div className="flex space-x-2">
                <input
                    type="text"
                    className="p-2 border rounded-md w-64"
                    placeholder="Enter property name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    onClick={handleSearch}
                    disabled={loading}
                >
                    {loading ? "Searching..." : "Search"}
                </button>
            </div>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            {property && (
                <div className="mt-6 p-4 bg-white shadow-md rounded-md w-96">
                    <h2 className="text-lg font-semibold">🏠 Property Details</h2>
                    <p><strong>Name:</strong> {property.name}</p>
                    <p><strong>Type:</strong> {property.propertyType}</p>
                    <p><strong>Serial Number:</strong> {property.serialNumber}</p>
                    <p><strong>Location:</strong> {property.location || "N/A"}</p>
                    <p><strong>Owner:</strong> {property.owner}</p>
                </div>
            )}
        </div>
    );
}
