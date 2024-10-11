// app/api/pexels/route.ts

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return new Response(
      JSON.stringify({ error: "Query parameter is required." }),
      { status: 400 }
    );
  }

  const apiKey = process.env.PEXELS_API_KEY;

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${query}&per_page=15`,
      {
        method: "GET",
        headers: {
          Authorization: apiKey || "",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch from Pexels API");
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
