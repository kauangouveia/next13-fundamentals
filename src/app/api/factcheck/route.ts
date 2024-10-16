// app/api/factcheck/route.js

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  const apiUrl = `https://factchecktools.googleapis.com/v1alpha1/claims:search?query=${query}&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
