export async function GET(
    req: Request, 
    { params }: { params: { name: string } }
): Promise<Response> {
    const { name } = params;

    try {
        const response = await fetch(`http://localhost:4000/property/name/${name}`);
        if (!response.ok) throw new Error("Property not found");

        const property = await response.json();
        return new Response(JSON.stringify(property), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Property not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" }
        });
    }
}
