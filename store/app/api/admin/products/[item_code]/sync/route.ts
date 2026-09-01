import { auth } from "@/auth";
import { NextResponse } from "next/server";

const API_URL = "https://api.blmantos.com.br";

export async function POST(
  request: Request,
  context: {
    params: Promise<{
      item_code: string;
    }>;
  }
) {
  const session = await auth();

  if (
    !session?.user?.email ||
    session.user.email !== process.env.ADMIN_EMAIL
  ) {
    return NextResponse.json(
      {
        success: false,
        detail: "Não autorizado.",
      },
      { status: 401 }
    );
  }

  const { item_code } = await context.params;

  try {
    const response = await fetch(
      `${API_URL}/api/admin/products/${encodeURIComponent(
        item_code
      )}/sync`,
      {
        method: "POST",
        headers: {
          "X-Admin-Secret":
            process.env.ADMIN_API_SECRET || "",
        },
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
      "ADMIN_PRODUCT_SYNC_ERROR",
      error
    );

    return NextResponse.json(
      {
        success: false,
        detail:
          "Não foi possível sincronizar o produto.",
      },
      { status: 500 }
    );
  }
}