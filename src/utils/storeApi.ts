// src/utils/storeApi.ts
// Central storefront data-fetching utility.
// All user-panel components should import from here — never from mockData.

import { fetchApi } from "./api";
import { Book, Author, Category, PromoSlide } from "@/types";

// ─── Banners ────────────────────────────────────────────────────────────────

export async function fetchBanners(): Promise<PromoSlide[]> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await fetchApi<any[]>("/api/banners.php");
    if (!Array.isArray(data)) return [];
    return data.map((b) => ({
      id: String(b.id),
      titlePrefix: b.title_prefix || b.titlePrefix || "",
      titleHighlighted: b.title_highlighted || b.titleHighlighted || "",
      titleSuffix: b.title_suffix || b.titleSuffix || "",
      subtitle: b.subtitle || "",
      imageUrl: b.image_url || b.imageUrl || "",
      actionUrl: b.action_url || b.actionUrl || "/shop",
    }));
  } catch {
    return [];
  }
}

// ─── Books ───────────────────────────────────────────────────────────────────

export type BookGroup =
  | "bestsellers"
  | "featured"
  | "onsale"
  | "mostviewed"
  | "deal_of_week"
  | "biographies"
  | "new_release";

export async function fetchBooks(group?: BookGroup, newReleaseTab?: string): Promise<Book[]> {
  try {
    const params = new URLSearchParams();
    if (group) params.append("group", group);
    if (newReleaseTab) params.append("new_release_tab", newReleaseTab);
    const qs = params.toString();
    const data = await fetchApi<Book[]>(`/api/books.php${qs ? `?${qs}` : ""}`);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function fetchBookById(id: string): Promise<Book | null> {
  try {
    return await fetchApi<Book>(`/api/books.php?id=${id}`);
  } catch {
    return null;
  }
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function fetchCategories(): Promise<Category[]> {
  try {
    const data = await fetchApi<Category[]>("/api/categories.php");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// ─── Authors ─────────────────────────────────────────────────────────────────

export async function fetchAuthors(): Promise<Author[]> {
  try {
    const data = await fetchApi<Author[]>("/api/authors.php");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// ─── Store Settings ───────────────────────────────────────────────────────────

export type StoreSettings = {
  store_name?: string;
  store_email?: string;
  store_phone?: string;
  store_address?: string;
  currency_symbol?: string;
  social_instagram?: string;
  social_facebook?: string;
  social_youtube?: string;
  social_twitter?: string;
};

export async function fetchStoreSettings(): Promise<StoreSettings> {
  try {
    const data = await fetchApi<StoreSettings>("/api/settings.php");
    return data || {};
  } catch {
    return {};
  }
}
