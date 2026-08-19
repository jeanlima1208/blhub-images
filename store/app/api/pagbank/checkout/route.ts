import { NextRequest, NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://163.176.237.176:8000";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(
      `${API_URL}/api/pagbank/checkout`,
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
      "Erro no proxy PagBank:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        detail: "Não foi possível iniciar o pagamento.",
      },
      { status: 500 }
    );
  }
}
