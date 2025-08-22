import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

function safeArray(input: unknown): unknown[] {
  return Array.isArray(input) ? input : [];
}

export async function GET() {
  //const data = advocateData;
  try {
    const data = await db.select().from(advocates);
    return new Response(JSON.stringify({ data: safeArray(data) }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ data: safeArray(advocateData) }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}
