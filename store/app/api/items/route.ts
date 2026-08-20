import { NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://163.176.237.176:8000";

export async function GET() {
  try {
    const response = await fetch(
      `${API_URL}/api/items`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Erro ao buscar produtos.",
        },
        {
          status: response.status,
        }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error(
      "Erro na rota /api/items:",
      error
    );

    return NextResponse.json(
      {
        error: "Não foi possível buscar os produtos.",
      },
      {
        status: 500,
      }
    );
  }
}