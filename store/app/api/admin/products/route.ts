import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://api.blmantos.com.br";

export async function GET() {
  try {
    const response = await fetch(
      `${API_URL}/api/admin/products`,
      {
        cache: "no-store",
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("ADMIN_PRODUCTS_GET_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        detail: "Não foi possível carregar os produtos.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const itemCode = body?.item_code;

    if (!itemCode) {
      return NextResponse.json(
        {
          success: false,
          detail: "item_code é obrigatório.",
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${API_URL}/api/admin/products/${encodeURIComponent(
        itemCode
      )}`,
      {
        method: "PUT",
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
    console.error("ADMIN_PRODUCTS_PUT_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        detail: "Não foi possível salvar o produto.",
      },
      { status: 500 }
    );
  }
}
