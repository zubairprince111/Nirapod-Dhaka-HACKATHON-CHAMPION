import { supabase } from "@/integrations/supabase/client";

export type ReportType = "crime" | "infrastructure" | "accident";
export type ReportStatus = "sent" | "received" | "resolved";

export type Report = {
  id: string;
  reporter_id: string | null;
  type: ReportType;
  subtype: string | null;
  photo_url: string | null;
  description: string;
  lat: number;
  lng: number;
  area_name: string | null;
  status: ReportStatus;
  created_at: string;
};

export type Hospital = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  beds_available: number;
  icu_available: number;
  phone: string | null;
};

export type PoliceStation = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  phone: string | null;
};

export type VoteCounts = { confirm: number; dispute: number; mine: "confirm" | "dispute" | null };

export const SUBTYPES: Record<ReportType, { key: string; bn: string; en: string }[]> = {
  crime: [
    { key: "snatching", bn: "ছিনতাই", en: "Snatching" },
    { key: "robbery", bn: "ডাকাতি", en: "Robbery" },
    { key: "harassment", bn: "হয়রানি", en: "Harassment" },
    { key: "theft", bn: "চুরি", en: "Theft" },
    { key: "other_crime", bn: "অন্যান্য", en: "Other" },
  ],
  infrastructure: [
    { key: "manhole", bn: "খোলা ম্যানহোল", en: "Open manhole" },
    { key: "drain", bn: "ভাঙা ড্রেন", en: "Damaged drain" },
    { key: "road", bn: "ভাঙা রাস্তা", en: "Broken road" },
    { key: "waterlogging", bn: "জলাবদ্ধতা", en: "Waterlogging" },
    { key: "streetlight", bn: "নষ্ট সড়কবাতি", en: "Broken street light" },
  ],
  accident: [
    { key: "road_accident", bn: "সড়ক দুর্ঘটনা", en: "Road accident" },
    { key: "fire", bn: "অগ্নিকাণ্ড", en: "Fire" },
    { key: "building", bn: "ভবন ধস", en: "Building collapse" },
    { key: "other_accident", bn: "অন্যান্য", en: "Other" },
  ],
};

export function subtypeLabel(key: string | null, lang: "bn" | "en"): string {
  if (!key) return "";
  for (const list of Object.values(SUBTYPES)) {
    const hit = list.find((s) => s.key === key);
    if (hit) return lang === "bn" ? hit.bn : hit.en;
  }
  return key;
}

export function routedTo(type: ReportType): ("city_corp" | "dmb" | "police")[] {
  if (type === "infrastructure") return ["city_corp", "dmb"];
  if (type === "crime") return ["city_corp", "police"];
  return ["city_corp", "dmb"];
}

export async function fetchReports(): Promise<Report[]> {
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw error;
  return (data ?? []) as Report[];
}

export async function fetchHospitals(): Promise<Hospital[]> {
  const { data, error } = await supabase.from("hospitals").select("*");
  if (error) throw error;
  return (data ?? []) as Hospital[];
}

export async function fetchStations(): Promise<PoliceStation[]> {
  const { data, error } = await supabase.from("police_stations").select("*");
  if (error) throw error;
  return (data ?? []) as PoliceStation[];
}

export async function fetchHotspots() {
  const { data, error } = await supabase.rpc("crime_hotspots");
  if (error) throw error;
  return (data ?? []) as { lat: number; lng: number; report_count: number }[];
}

export async function fetchVotes(reportId: string, userId?: string | null): Promise<VoteCounts> {
  const { data } = await supabase
    .from("report_votes")
    .select("vote, user_id")
    .eq("report_id", reportId);
  const rows = data ?? [];
  return {
    confirm: rows.filter((r) => r.vote === "confirm").length,
    dispute: rows.filter((r) => r.vote === "dispute").length,
    mine: userId
      ? ((rows.find((r) => r.user_id === userId)?.vote as "confirm" | "dispute") ?? null)
      : null,
  };
}

export async function castVote(reportId: string, userId: string, vote: "confirm" | "dispute") {
  const { error } = await supabase
    .from("report_votes")
    .upsert({ report_id: reportId, user_id: userId, vote }, { onConflict: "report_id,user_id" });
  if (error) throw error;
}

const signedCache = new Map<string, string>();

export async function photoUrl(path: string | null): Promise<string | null> {
  if (!path) return null;
  if (signedCache.has(path)) return signedCache.get(path)!;
  const { data } = await supabase.storage.from("report-photos").createSignedUrl(path, 3600);
  if (data?.signedUrl) {
    signedCache.set(path, data.signedUrl);
    return data.signedUrl;
  }
  return null;
}

export async function uploadPhoto(file: File, userId: string): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("report-photos").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  return path;
}

export function timeAgo(iso: string, lang: "bn" | "en"): string {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return lang === "bn" ? `${mins} মিনিট আগে` : `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return lang === "bn" ? `${hours} ঘণ্টা আগে` : `${hours} h ago`;
  const days = Math.round(hours / 24);
  return lang === "bn" ? `${days} দিন আগে` : `${days} d ago`;
}

export function isFresh(iso: string): boolean {
  return Date.now() - new Date(iso).getTime() < 60 * 60 * 1000;
}
