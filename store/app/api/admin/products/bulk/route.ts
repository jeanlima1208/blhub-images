import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://api.blmantos.com.br";

async function requireAdmin() {
  const session = await auth();

  if (
    !session?.user?.email ||
    session.user.email !== process.env.ADMIN_EMAIL
  ) {
    return false;
  }

  return true;
}

export async function PUT(
  request: NextRequest
) {
  if (!(await requireAdmin())) {
    return NextResponse.json(
      {
        success: false,
        detail: "Não autorizado.",
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const response = await fetch(
      `${API_URL}/api/admin/products/bulk`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json",
          "X-Admin-Secret":
            process.env.ADMIN_API_SECRET || "",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      }
    );

    const text = await response.text();

    let data: unknown;

    try {
      data = JSON.parse(text);
    } catch {
      data = {
        success: false,
        detail:
          "A API retornou uma resposta inválida.",
      };
    }

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error(
      "ADMIN_PRODUCTS_BULK_ERROR",
      error
    );

    return NextResponse.json(
      {
        success: false,
        detail:
          "Não foi possível aplicar a alteração.",
      },
      { status: 500 }
    );
  }
}
