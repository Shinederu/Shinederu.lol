import { AnnouncementType } from "@/types/Announcement";

type ApiResult<T> = {
  ok: boolean;
  data: T | null;
  error: string | null;
};

type ApiResponseShape = {
  success?: boolean;
  error?: string;
  message?: string;
  data?: {
    announcements?: unknown[];
    announcement?: unknown;
    total?: number;
  };
};

const baseUrl = import.meta.env.VITE_SHINEDERU_API_MAIN_SITE_URL;
const debugEnabled = import.meta.env.DEV || import.meta.env.VITE_DEV_MODE === "true";

const debugLog = (scope: string, payload?: unknown) => {
  if (!debugEnabled) return;
  console.log(`[main-site-api] ${scope}`, payload ?? "");
};

const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object";

const mapAnnouncement = (entry: unknown): AnnouncementType | null => {
  if (!isRecord(entry)) return null;
  const id = Number(entry.id ?? 0);
  if (!Number.isFinite(id) || id <= 0) return null;

  return {
    id,
    title: String(entry.title ?? ""),
    message: String(entry.message ?? ""),
    buttonLabel: String(entry.buttonLabel ?? ""),
    buttonLink: String(entry.buttonLink ?? ""),
    publishedAt: String(entry.publishedAt ?? ""),
    createdAt: String(entry.createdAt ?? ""),
    updatedAt: String(entry.updatedAt ?? ""),
  };
};

const buildUrl = (action: string, params?: Record<string, string | number>) => {
  const query = new URLSearchParams({ action });
  if (params) {
    Object.entries(params).forEach(([key, value]) => query.set(key, String(value)));
  }
  return `${baseUrl}?${query.toString()}`;
};

const parseJson = async (response: Response): Promise<ApiResponseShape> => {
  try {
    return (await response.json()) as ApiResponseShape;
  } catch {
    return {};
  }
};

const getErrorMessage = (payload: ApiResponseShape, fallback: string) => {
  if (payload.error && payload.error.trim()) return payload.error;
  if (payload.message && payload.message.trim()) return payload.message;
  return fallback;
};

export const listPublicAnnouncements = async (): Promise<ApiResult<{ announcements: AnnouncementType[]; total: number }>> => {
  try {
    debugLog("GET listPublicAnnouncements request", { baseUrl });
    const response = await fetch(buildUrl("listPublicAnnouncements", { limit: 100, offset: 0 }), {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    const payload = await parseJson(response);
    debugLog("GET listPublicAnnouncements response", { status: response.status, payload });

    if (!response.ok || payload.success === false) {
      return { ok: false, data: null, error: getErrorMessage(payload, "Impossible de charger les annonces.") };
    }

    const raw = Array.isArray(payload.data?.announcements) ? payload.data?.announcements ?? [] : [];
    const announcements = raw.map(mapAnnouncement).filter((entry): entry is AnnouncementType => entry !== null);
    return {
      ok: true,
      data: {
        announcements,
        total: Number(payload.data?.total ?? announcements.length),
      },
      error: null,
    };
  } catch (error) {
    debugLog("GET listPublicAnnouncements error", error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : "Erreur reseau",
    };
  }
};

export const listAnnouncementsAdmin = async (): Promise<ApiResult<{ announcements: AnnouncementType[]; total: number }>> => {
  try {
    debugLog("GET listAnnouncements request", { baseUrl });
    const response = await fetch(buildUrl("listAnnouncements", { limit: 200, offset: 0 }), {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    });
    const payload = await parseJson(response);
    debugLog("GET listAnnouncements response", { status: response.status, payload });

    if (!response.ok || payload.success === false) {
      return { ok: false, data: null, error: getErrorMessage(payload, "Impossible de charger les annonces.") };
    }

    const raw = Array.isArray(payload.data?.announcements) ? payload.data?.announcements ?? [] : [];
    const announcements = raw.map(mapAnnouncement).filter((entry): entry is AnnouncementType => entry !== null);
    return {
      ok: true,
      data: {
        announcements,
        total: Number(payload.data?.total ?? announcements.length),
      },
      error: null,
    };
  } catch (error) {
    debugLog("GET listAnnouncements error", error);
    return {
      ok: false,
      data: null,
      error: error instanceof Error ? error.message : "Erreur reseau",
    };
  }
};

type UpsertPayload = {
  title: string;
  message: string;
  buttonLabel: string;
  buttonLink: string;
  publishedAt: string;
};

export const createAnnouncement = async (payload: UpsertPayload): Promise<ApiResult<AnnouncementType>> => {
  try {
    debugLog("POST createAnnouncement request", payload);
    const response = await fetch(baseUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "createAnnouncement", ...payload }),
    });
    const json = await parseJson(response);
    debugLog("POST createAnnouncement response", { status: response.status, payload: json });
    if (!response.ok || json.success === false) {
      return { ok: false, data: null, error: getErrorMessage(json, "Creation impossible.") };
    }

    const mapped = mapAnnouncement(json.data?.announcement ?? null);
    return { ok: true, data: mapped, error: null };
  } catch (error) {
    debugLog("POST createAnnouncement error", error);
    return { ok: false, data: null, error: error instanceof Error ? error.message : "Erreur reseau" };
  }
};

export const updateAnnouncement = async (id: number, payload: UpsertPayload): Promise<ApiResult<AnnouncementType>> => {
  try {
    debugLog("POST updateAnnouncement request", { id, ...payload });
    const response = await fetch(baseUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "updateAnnouncement", id, ...payload }),
    });
    const json = await parseJson(response);
    debugLog("POST updateAnnouncement response", { status: response.status, payload: json });
    if (!response.ok || json.success === false) {
      return { ok: false, data: null, error: getErrorMessage(json, "Mise a jour impossible.") };
    }

    const mapped = mapAnnouncement(json.data?.announcement ?? null);
    return { ok: true, data: mapped, error: null };
  } catch (error) {
    debugLog("POST updateAnnouncement error", error);
    return { ok: false, data: null, error: error instanceof Error ? error.message : "Erreur reseau" };
  }
};

export const deleteAnnouncement = async (id: number): Promise<ApiResult<null>> => {
  try {
    debugLog("POST deleteAnnouncement request", { id });
    const response = await fetch(baseUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: "deleteAnnouncement", id }),
    });
    const json = await parseJson(response);
    debugLog("POST deleteAnnouncement response", { status: response.status, payload: json });
    if (!response.ok || json.success === false) {
      return { ok: false, data: null, error: getErrorMessage(json, "Suppression impossible.") };
    }
    return { ok: true, data: null, error: null };
  } catch (error) {
    debugLog("POST deleteAnnouncement error", error);
    return { ok: false, data: null, error: error instanceof Error ? error.message : "Erreur reseau" };
  }
};
