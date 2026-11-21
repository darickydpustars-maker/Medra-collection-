import { CartItem, StoreData } from '../types/store';
import { DEFAULT_STORE_DATA } from '../data/defaultStore';

const DB_NAME = 'medra_collection_media_db';
const DB_VERSION = 1;
const MEDIA_STORE = 'media_blobs';

const STORE_DATA_KEY = 'medra_collection_store_v1';
const CART_DATA_KEY = 'medra_collection_cart_v1';
const MEDIA_FALLBACK_PREFIX = 'medra_media_fallback_';

// In-memory cache of active Object URLs so we can reuse and revoke cleanly
const objectUrlCache = new Map<string, string>();

function openMediaDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(MEDIA_STORE)) {
        db.createObjectStore(MEDIA_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Failed to open IndexedDB'));
  });
}

function readFileAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as data URL'));
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error('FileReader error'));
    reader.readAsDataURL(file);
  });
}

export function generateMediaId(prefix = 'img'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function saveMediaFile(file: File, previousId?: string | null): Promise<{ mediaId: string; url: string }> {
  const mediaId = generateMediaId('medra');

  if (previousId) {
    await deleteMediaFile(previousId);
  }

  try {
    const db = await openMediaDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(MEDIA_STORE, 'readwrite');
      const store = tx.objectStore(MEDIA_STORE);
      const req = store.put(file, mediaId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error ?? new Error('Failed to store blob'));
    });
    db.close();

    const url = URL.createObjectURL(file);
    objectUrlCache.set(mediaId, url);
    return { mediaId, url };
  } catch {
    // Fallback to FileReader + localStorage for restricted browser contexts
    const dataUrl = await readFileAsDataUrl(file);
    try {
      localStorage.setItem(`${MEDIA_FALLBACK_PREFIX}${mediaId}`, dataUrl);
    } catch {
      // Ignore quota error in fallback; still return dataUrl for current session
    }
    objectUrlCache.set(mediaId, dataUrl);
    return { mediaId, url: dataUrl };
  }
}

export async function loadAllMediaUrls(mediaIds: (string | null | undefined)[]): Promise<Record<string, string>> {
  const uniqueIds = Array.from(new Set(mediaIds.filter((id): id is string => Boolean(id))));
  const result: Record<string, string> = {};

  if (uniqueIds.length === 0) {
    return result;
  }

  let db: IDBDatabase | null = null;
  try {
    db = await openMediaDB();
  } catch {
    db = null;
  }

  for (const id of uniqueIds) {
    const cached = objectUrlCache.get(id);
    if (cached) {
      result[id] = cached;
      continue;
    }

    if (db) {
      try {
        const blob = await new Promise<Blob | string | undefined>((resolve, reject) => {
          const tx = db!.transaction(MEDIA_STORE, 'readonly');
          const store = tx.objectStore(MEDIA_STORE);
          const req = store.get(id);
          req.onsuccess = () => resolve(req.result as Blob | string | undefined);
          req.onerror = () => reject(req.error);
        });

        if (blob instanceof Blob) {
          const url = URL.createObjectURL(blob);
          objectUrlCache.set(id, url);
          result[id] = url;
          continue;
        } else if (typeof blob === 'string') {
          objectUrlCache.set(id, blob);
          result[id] = blob;
          continue;
        }
      } catch {
        // Fall through to localStorage check
      }
    }

    const fallback = localStorage.getItem(`${MEDIA_FALLBACK_PREFIX}${id}`);
    if (fallback) {
      objectUrlCache.set(id, fallback);
      result[id] = fallback;
    }
  }

  if (db) {
    db.close();
  }

  return result;
}

export async function deleteMediaFile(mediaId: string): Promise<void> {
  const cached = objectUrlCache.get(mediaId);
  if (cached && cached.startsWith('blob:')) {
    URL.revokeObjectURL(cached);
  }
  objectUrlCache.delete(mediaId);
  localStorage.removeItem(`${MEDIA_FALLBACK_PREFIX}${mediaId}`);

  try {
    const db = await openMediaDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(MEDIA_STORE, 'readwrite');
      const store = tx.objectStore(MEDIA_STORE);
      const req = store.delete(mediaId);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    db.close();
  } catch {
    // Ignore cleanup errors
  }
}

export async function clearAllMediaFiles(): Promise<void> {
  for (const url of objectUrlCache.values()) {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }
  objectUrlCache.clear();

  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key && key.startsWith(MEDIA_FALLBACK_PREFIX)) {
      localStorage.removeItem(key);
    }
  }

  try {
    const db = await openMediaDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(MEDIA_STORE, 'readwrite');
      const store = tx.objectStore(MEDIA_STORE);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
    db.close();
  } catch {
    // Ignore
  }
}

export function loadStoreData(): StoreData {
  try {
    const raw = localStorage.getItem(STORE_DATA_KEY);
    if (!raw) return DEFAULT_STORE_DATA;
    const parsed = JSON.parse(raw) as Partial<StoreData>;
    return {
      hero: parsed.hero ?? DEFAULT_STORE_DATA.hero,
      products: Array.isArray(parsed.products) ? parsed.products : DEFAULT_STORE_DATA.products,
      lookbook: Array.isArray(parsed.lookbook) ? parsed.lookbook : DEFAULT_STORE_DATA.lookbook,
      about: parsed.about ?? DEFAULT_STORE_DATA.about,
    };
  } catch {
    return DEFAULT_STORE_DATA;
  }
}

export function saveStoreData(data: StoreData): void {
  try {
    localStorage.setItem(STORE_DATA_KEY, JSON.stringify(data));
  } catch {
    // Ignore quota errors
  }
}

export function loadCartItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_DATA_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCartItems(items: CartItem[]): void {
  try {
    localStorage.setItem(CART_DATA_KEY, JSON.stringify(items));
  } catch {
    // Ignore
  }
}
