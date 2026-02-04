import { cookies } from "next/headers";
import { NextRequest } from "next/server";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { searchParams } = new URL(request.url);
  const entity: string = searchParams.get("entity") || "";

  const { id } = await params;

  const cks = await cookies()
  const session = JSON.parse(cks.get("ctf-session")?.value || "");
  const token = session.token;

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const backendResponse = await fetch(
    `${process.env.API_URL}/admin/${entity}/metrics/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!backendResponse.ok) {
    return new Response("Erro ao gerar planilha", {
      status: backendResponse.status,
    });
  }

  return new Response(backendResponse.body, {
    // headers: {
    //   "Content-Type":
    //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    //   "Content-Disposition": `inline; filename="relatorio-${id}.xlsx"`,
    // },
    headers: backendResponse.headers,
  });
}
