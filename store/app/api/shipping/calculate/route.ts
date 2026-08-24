import { NextResponse } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://163.176.237.176:8000";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(
      `${API_URL}/api/shipping/calculate`,
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

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error(
      "Erro na rota /api/shipping/calculate:",
      error
    );

    return NextResponse.json(
      {
        error: "Não foi possível calcular o frete.",
      },
      {
        status: 500,
      }
    );
  }
}