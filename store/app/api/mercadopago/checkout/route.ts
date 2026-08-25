import { NextRequest, NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.blmantos.com.br";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(
      `${API_URL}/api/mercadopago/checkout`,
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
      "Erro no proxy Mercado Pago:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        detail:
          "Não foi possível iniciar o pagamento.",
      },
      { status: 500 }
    );
  }
}
