import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

function asArray(input: unknown): any[] {
  return Array.isArray(input) ? input : [];
}

function normalizeRow(row: any) {
  const firstName = row.firstName ?? row.first_name ?? "";
  const lastName = row.lastName ?? row.last_name ?? "";
  const city = row.city ?? row.city ?? "";
  const degree = row.degree ?? row.degree ?? "";

  let specialties: string[] = [];
  if (Array.isArray(row.specialties)) specialties = row.specialties.map(String);
  else if (Array.isArray(row.payload)) specialties = row.payload.map(String);
  else if (typeof row.specialties === "string") {
    try {
      const parsed = JSON.parse(row.specialties);
      specialties = Array.isArray(parsed)
        ? parsed.map(String)
        : [String(parsed)];
    } catch {
      specialties = row.specialties
        .split(/[,|;]+/)
        .map((s: string) => s.trim());
    }
  }

  specialties = specialties
    .map((s) => String(s ?? "").trim())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

  const yearsOfExperience =
    row.yearsOfExperience ?? row.years_of_experience ?? row.years ?? null;
  const phoneNumber = row.phoneNumber ?? row.phone_number ?? row.phone ?? null;

  return {
    id: row.id ?? null,
    firstName: String(firstName ?? ""),
    lastName: String(lastName ?? ""),
    city: String(city ?? ""),
    degree: String(degree ?? ""),
    specialties,
    yearsOfExperience:
      yearsOfExperience == null ? "" : String(yearsOfExperience),
    phoneNumber: phoneNumber == null ? "" : String(phoneNumber),
  };
}

function dedupe(rows: any[]) {
  // Only dedupe when the entire normalized row is identical.
  const seen = new Set<string>();
  const out: any[] = [];
  for (const r of rows) {
    // JSON stringify the normalized object excluding `id` so differing ids
    // (e.g. DB primary keys) don't prevent deduplication of identical rows.
    const { id, ...rest } = r;
    const key = JSON.stringify(rest);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(r);
  }
  return out;
}

export async function GET() {
  try {
    const raw = await db.select().from(advocates);
    const normalized = asArray(raw).map(normalizeRow);
    const deduped = dedupe(normalized);
    const withId = deduped.map((r) => ({
      ...r,
      id: r.id ?? crypto?.randomUUID?.() ?? `${r.phoneNumber}-${r.lastName}`,
    }));
    return new Response(JSON.stringify({ data: withId }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const raw = asArray(advocateData);
    const normalized = raw.map(normalizeRow);
    const deduped = dedupe(normalized);
    const withId = deduped.map((r) => ({
      ...r,
      id: r.id ?? crypto?.randomUUID?.() ?? `${r.phoneNumber}-${r.lastName}`,
    }));
    return new Response(JSON.stringify({ data: withId }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}
