import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://api.blmantos.com.br";

export async function POST(
  request: NextRequest,
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
    const incoming = await request.formData();
    const file = incoming.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          detail: "Imagem obrigatória.",
        },
        { status: 400 }
      );
    }

    const body = new FormData();
    body.append("file", file);

    const response = await fetch(
      `${API_URL}/api/admin/products/${encodeURIComponent(
        item_code
      )}/image`,
      {
        method: "POST",
        headers: {
          "X-Admin-Secret":
            process.env.ADMIN_API_SECRET || "",
        },
        body,
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
      "ADMIN_PRODUCT_IMAGE_ERROR",
      error
    );

    return NextResponse.json(
      {
        success: false,
        detail:
          "Não foi possível enviar a imagem.",
      },
      { status: 500 }
    );
  }
}