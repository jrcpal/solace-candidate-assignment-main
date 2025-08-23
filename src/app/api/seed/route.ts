import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function POST() {

  if (typeof (db as any).insert !== "function") {
    return new Response(JSON.stringify({ error: "Database not configured." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const records = await(db as any)
    .insert(advocates)
    .values(advocateData)
    .returning();

  return (
    Response.json({ advocates: records }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
