import { NextRequest, NextResponse } from "next/server";

const API_URL = "http://163.176.237.176:8000";

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

    const raw = await response.text();

    console.log("MP_BACKEND_RESPONSE", {
      status: response.status,
      contentType: response.headers.get("content-type"),
      body: raw.slice(0, 2000),
    });

    let data: unknown;

    try {
      data = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        {
          success: false,
          detail: "Backend retornou resposta inválida.",
          backend_status: response.status,
          backend_response: raw.slice(0, 1000),
        },
        { status: 502 }
      );
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("MP_PROXY_ERROR", {
      message:
        error instanceof Error
          ? error.message
          : String(error),
      stack:
        error instanceof Error
          ? error.stack
          : undefined,
    });

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
