import { describe, it, expect, beforeEach } from "vitest";

/**
 * Tests pour la sauvegarde de progression du SmartForm
 * 
 * Note : les fonctions saveProgress, loadProgress, clearProgress et formatTimeSince
 * sont des fonctions frontend (localStorage). On teste ici la logique pure
 * en simulant localStorage via un simple objet Map.
 */

// ─── Simulation localStorage ──────────────────────────────────────────────────
const store = new Map<string, string>();

const mockLocalStorage = {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => store.set(key, value),
  removeItem: (key: string) => store.delete(key),
};

const STORAGE_KEY = "hallucine_smartform_progress";
const EXPIRY_DAYS = 7;

interface SavedProgress {
  product: string | null;
  productDetail: string;
  email: string;
  phone: string;
  prenom: string;
  nom: string;
  entreprise: string;
  country: string;
  city: string;
  postalCode: string;
  message: string;
  currentStep: number;
  savedAt: number;
  mode?: string;
}

// ─── Fonctions répliquées depuis SmartForm.tsx ────────────────────────────────
function saveProgress(data: SavedProgress): void {
  try {
    mockLocalStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // silencieux
  }
}

function loadProgress(): SavedProgress | null {
  try {
    const raw = mockLocalStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data: SavedProgress = JSON.parse(raw);
    const expiryMs = EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    if (Date.now() - data.savedAt > expiryMs) {
      mockLocalStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    mockLocalStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function clearProgress(): void {
  try {
    mockLocalStorage.removeItem(STORAGE_KEY);
  } catch {
    // silencieux
  }
}

function formatTimeSince(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `il y a ${days} jour${days > 1 ? "s" : ""}`;
  if (hours > 0) return `il y a ${hours}h`;
  if (minutes > 0) return `il y a ${minutes} min`;
  return "à l'instant";
}

// ─── Données de test ──────────────────────────────────────────────────────────
const sampleProgress: SavedProgress = {
  product: "ecran",
  productDetail: "9-10m",
  email: "test@example.com",
  phone: "+33 6 12 34 56 78",
  prenom: "Jean",
  nom: "Dupont",
  entreprise: "Acme Corp",
  country: "France",
  city: "Paris",
  postalCode: "75001",
  message: "Événement en juillet",
  currentStep: 4,
  savedAt: Date.now(),
  mode: "full",
};

// ─── Tests ────────────────────────────────────────────────────────────────────
describe("SmartForm — Sauvegarde de progression", () => {
  beforeEach(() => {
    store.clear();
  });

  it("saveProgress stocke les données dans localStorage", () => {
    saveProgress(sampleProgress);
    const raw = mockLocalStorage.getItem(STORAGE_KEY);
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw!);
    expect(parsed.product).toBe("ecran");
    expect(parsed.email).toBe("test@example.com");
    expect(parsed.currentStep).toBe(4);
  });

  it("loadProgress restaure les données sauvegardées", () => {
    saveProgress(sampleProgress);
    const loaded = loadProgress();
    expect(loaded).toBeTruthy();
    expect(loaded!.product).toBe("ecran");
    expect(loaded!.productDetail).toBe("9-10m");
    expect(loaded!.prenom).toBe("Jean");
    expect(loaded!.nom).toBe("Dupont");
    expect(loaded!.entreprise).toBe("Acme Corp");
    expect(loaded!.country).toBe("France");
    expect(loaded!.city).toBe("Paris");
    expect(loaded!.postalCode).toBe("75001");
    expect(loaded!.phone).toBe("+33 6 12 34 56 78");
    expect(loaded!.message).toBe("Événement en juillet");
  });

  it("loadProgress retourne null si aucune donnée sauvegardée", () => {
    const loaded = loadProgress();
    expect(loaded).toBeNull();
  });

  it("loadProgress retourne null si les données sont expirées (> 7 jours)", () => {
    const expiredProgress = {
      ...sampleProgress,
      savedAt: Date.now() - (8 * 24 * 60 * 60 * 1000), // 8 jours
    };
    saveProgress(expiredProgress);
    const loaded = loadProgress();
    expect(loaded).toBeNull();
    // Vérifie que les données expirées sont nettoyées
    expect(mockLocalStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("loadProgress retourne les données si elles ont moins de 7 jours", () => {
    const recentProgress = {
      ...sampleProgress,
      savedAt: Date.now() - (6 * 24 * 60 * 60 * 1000), // 6 jours
    };
    saveProgress(recentProgress);
    const loaded = loadProgress();
    expect(loaded).toBeTruthy();
    expect(loaded!.product).toBe("ecran");
  });

  it("clearProgress supprime les données sauvegardées", () => {
    saveProgress(sampleProgress);
    expect(mockLocalStorage.getItem(STORAGE_KEY)).toBeTruthy();
    clearProgress();
    expect(mockLocalStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("loadProgress gère les données corrompues gracieusement", () => {
    mockLocalStorage.setItem(STORAGE_KEY, "invalid-json{{{");
    const loaded = loadProgress();
    expect(loaded).toBeNull();
    // Vérifie que les données corrompues sont nettoyées
    expect(mockLocalStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("saveProgress met à jour les données existantes", () => {
    saveProgress(sampleProgress);
    const updatedProgress = {
      ...sampleProgress,
      currentStep: 5,
      city: "Lyon",
      email: "updated@example.com",
    };
    saveProgress(updatedProgress);
    const loaded = loadProgress();
    expect(loaded!.currentStep).toBe(5);
    expect(loaded!.city).toBe("Lyon");
    expect(loaded!.email).toBe("updated@example.com");
  });

  it("sauvegarde tous les champs du formulaire correctement", () => {
    const fullProgress: SavedProgress = {
      product: "tente",
      productDetail: "publicitaire",
      email: "contact@entreprise.fr",
      phone: "+32 2 123 45 67",
      prenom: "Marie",
      nom: "Martin",
      entreprise: "Entreprise SA",
      country: "Belgique",
      city: "Bruxelles",
      postalCode: "1000",
      message: "Besoin pour un salon professionnel en mars",
      currentStep: 6,
      savedAt: Date.now(),
      mode: "gate",
    };
    saveProgress(fullProgress);
    const loaded = loadProgress();
    expect(loaded).toEqual(fullProgress);
  });
});

describe("formatTimeSince", () => {
  it("retourne 'à l'instant' pour un timestamp récent", () => {
    expect(formatTimeSince(Date.now() - 5000)).toBe("à l'instant");
  });

  it("retourne 'il y a X min' pour des minutes", () => {
    expect(formatTimeSince(Date.now() - 15 * 60000)).toBe("il y a 15 min");
  });

  it("retourne 'il y a Xh' pour des heures", () => {
    expect(formatTimeSince(Date.now() - 3 * 3600000)).toBe("il y a 3h");
  });

  it("retourne 'il y a X jour(s)' pour des jours", () => {
    expect(formatTimeSince(Date.now() - 1 * 86400000)).toBe("il y a 1 jour");
    expect(formatTimeSince(Date.now() - 3 * 86400000)).toBe("il y a 3 jours");
  });
});
