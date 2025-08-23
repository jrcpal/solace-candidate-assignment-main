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
  // Remove duplicates to prevent showing the same advocate multiple times
  const seen = new Set<string>();
  const out: any[] = [];
  for (const r of rows) {
    // Exclude id from comparison since different data sources may have different IDs for the same person
    const { id, ...rest } = r;
    const key = JSON.stringify(rest);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(r);
  }
  return out;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") || "").trim();
  const limit = Math.min(Number(url.searchParams.get("limit") || 50), 1000);
  const offset = Math.max(Number(url.searchParams.get("offset") || 0), 0);
  let total = 0;

  try {
    let rawRows: any[] = [];

    if (q) {
      const term = `%${q}%`;
      const isNumericSearch = /^\d+$/.test(q.trim());
      
      let sql: string;
      let params: any[];
      
      if (isNumericSearch) {
        // For numeric searches, be more specific:
        // - Exact match on years_of_experience
        // - Still allow partial matches on text fields
        // - Be more selective with phone numbers (only match if it's a significant part)
        sql = `
          SELECT id, first_name, last_name, city, degree, specialties, years_of_experience, phone_number
          FROM advocates
          WHERE years_of_experience = $1
            OR first_name ILIKE $2
            OR last_name ILIKE $2
            OR city ILIKE $2
            OR degree ILIKE $2
            OR specialties::text ILIKE $2
          ORDER BY 
            CASE WHEN years_of_experience = $1 THEN 1 ELSE 2 END,
            last_name
          LIMIT $3 OFFSET $4
        `;
        params = [parseInt(q.trim()), term, limit, offset];
      } else {
        // For text searches, search across all fields normally
        sql = `
          SELECT id, first_name, last_name, city, degree, specialties, years_of_experience, phone_number
          FROM advocates
          WHERE first_name ILIKE $1
            OR last_name ILIKE $1
            OR city ILIKE $1
            OR degree ILIKE $1
            OR specialties::text ILIKE $1
            OR years_of_experience::text ILIKE $1
            OR phone_number::text ILIKE $1
          ORDER BY last_name
          LIMIT $2 OFFSET $3
        `;
        params = [term, limit, offset];
      }
      
      const res = await (db as any).query(sql, params);
      rawRows = res?.rows ?? res ?? [];
      
      // Get total count for filtered query
      let countSql: string;
      let countParams: any[];
      
      if (isNumericSearch) {
        countSql = `
          SELECT COUNT(*) AS count
          FROM advocates
          WHERE years_of_experience = $1
            OR first_name ILIKE $2
            OR last_name ILIKE $2
            OR city ILIKE $2
            OR degree ILIKE $2
            OR specialties::text ILIKE $2
        `;
        countParams = [parseInt(q.trim()), term];
      } else {
        countSql = `
          SELECT COUNT(*) AS count
          FROM advocates
          WHERE first_name ILIKE $1
            OR last_name ILIKE $1
            OR city ILIKE $1
            OR degree ILIKE $1
            OR specialties::text ILIKE $1
            OR years_of_experience::text ILIKE $1
            OR phone_number::text ILIKE $1
        `;
        countParams = [term];
      }
      
      const countRes = await (db as any).query(countSql, countParams);
      total = Number(countRes?.rows?.[0]?.count ?? countRes?.[0]?.count ?? 0);
    } else {
      const sql = `
        SELECT id, first_name, last_name, city, degree, specialties, years_of_experience, phone_number
        FROM advocates
        ORDER BY last_name
        LIMIT $1 OFFSET $2
      `;
      const res = await (db as any).query(sql, [limit, offset]);
      rawRows = res?.rows ?? res ?? [];
      // Get total count for unfiltered query
      const countSql = `SELECT COUNT(*) AS count FROM advocates`;
      const countRes = await (db as any).query(countSql);
      total = Number(countRes?.rows?.[0]?.count ?? countRes?.[0]?.count ?? 0);
    }

    const normalized = asArray(rawRows).map(normalizeRow);
    const deduped = dedupe(normalized);
    const withId = deduped.map((r) => ({
      ...r,
      id: r.id ?? crypto?.randomUUID?.() ?? `${r.phoneNumber}-${r.lastName}`,
    }));
    return new Response(JSON.stringify({ data: withId, total }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const raw = asArray(advocateData);
    const normalized = raw.map(normalizeRow);
    let deduped = dedupe(normalized);

    if (q) {
      const searchTerm = q.toLowerCase().trim();
      const isNumericSearch = /^\d+$/.test(searchTerm);
      
      if (isNumericSearch) {
        const searchNumber = parseInt(searchTerm);
        // For numeric searches, prioritize exact years of experience matches
        deduped = deduped.filter((advocate) => {
          if (parseInt(advocate.yearsOfExperience || "0") === searchNumber) {
            return true;
          }
          
          const textFields = [
            advocate.firstName || "",
            advocate.lastName || "",
            advocate.city || "",
            advocate.degree || "",
            (advocate.specialties || []).join(" "),
          ];

          return textFields.some((field) =>
            String(field).toLowerCase().includes(searchTerm)
          );
        });
        
        deduped.sort((a, b) => {
          const aExactMatch = parseInt(a.yearsOfExperience || "0") === searchNumber;
          const bExactMatch = parseInt(b.yearsOfExperience || "0") === searchNumber;
          
          if (aExactMatch && !bExactMatch) return -1;
          if (!aExactMatch && bExactMatch) return 1;
          return 0;
        });
      } else {
        deduped = deduped.filter((advocate) => {
          const searchableFields = [
            advocate.firstName || "",
            advocate.lastName || "",
            advocate.city || "",
            advocate.degree || "",
            (advocate.specialties || []).join(" "),
            advocate.yearsOfExperience || "",
            advocate.phoneNumber || "",
          ];

          return searchableFields.some((field) =>
            String(field).toLowerCase().includes(searchTerm)
          );
        });
      }
    }

    const withId = deduped.map((r) => ({
      ...r,
      id: r.id ?? crypto?.randomUUID?.() ?? `${r.phoneNumber}-${r.lastName}`,
    }));
    return new Response(
      JSON.stringify({ data: withId, total: withId.length }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
