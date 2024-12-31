import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.NEON_DATABASE_URL}`);
    const { email, name, clerkId } = await request.json();

    if (!email || !name || !clerkId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const response = await sql`
    INSERT INTO users (name, email, clerkId)
    VALUES (${name}, ${email}, ${clerkId})
  `;
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
