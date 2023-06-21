import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  const secret = request.headers.get("x-mara-revalidate-secret");

  if (secret !== process.env.REVALIDATION_SECRET_TOKEN) {
    return new NextResponse(JSON.stringify({ message: "Invalid Token" }), {
      status: 401,
      statusText: "Unauthorized",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const path = request.nextUrl.searchParams.get("path") || "/";

  console.log("revalidating ", path);
  revalidatePath(path);

  return NextResponse.json({ revalidated: true });
}
