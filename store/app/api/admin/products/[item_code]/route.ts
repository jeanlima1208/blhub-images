import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://api.blmantos.com.br";

async function requireAdmin() {
  const session = await auth();

  if (
    !session?.user?.email ||
    session.user.email !== process.env.ADMIN_EMAIL
  ) {
    return null;
  }

  return session;
}

async function safeJson(response: Response) {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    return {
      success: false,
      detail: "A API retornou uma resposta inválida.",
    };
  }
}

export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{
      item_code: string;
    }>;
  }
) {
  const session = await requireAdmin();

  if (!session) {
    return NextResponse.json(
      {
        success: false,
        detail: "Não autorizado.",
      },
      { status: 401 }
    );
  }

  try {
    const { item_code } = await context.params;
    const body = await request.json();

    if (!item_code) {
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
        item_code
      )}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Secret":
            process.env.ADMIN_API_SECRET || "",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      }
    );

    const data = await safeJson(response);

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error(
      "ADMIN_PRODUCT_PUT_ERROR",
      error
    );

    return NextResponse.json(
      {
        success: false,
        detail: "Não foi possível salvar o produto.",
      },
      { status: 500 }
    );
  }
}