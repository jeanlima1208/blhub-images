import { NextRequest, NextResponse } from "next/server";

const API_URL = "http://163.176.237.176:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(
      `${API_URL}/api/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      }
    );

    const data = await response.json();

    return NextResponse.json(
      data,
      { status: response.status }
    );
  } catch (error) {
    console.error(
      "Erro no proxy de pedidos:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        detail:
          "NÃ£o foi possÃ­vel criar o pedido.",
      },
      { status: 500 }
    );
  }
}

