export type Manual = {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
};

export type AssemblyStep = {
  id: string;
  title: string;
  description?: string;
  parts?: string[];
  tools?: string[];
};

export type AssemblyScene = {
  id: string;
  steps: AssemblyStep[];
};

const MOCK_MANUALS: Manual[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `manual-${i + 1}`,
  name: [
    "BILLY Bookcase",
    "MALM Dresser",
    "POÄNG Chair",
    "LACK Table",
    "KALLAX Shelf",
    "HEMNES Bed",
  ][i % 6],
  imageUrl: `https://www.ikea.com/us/en/images/products/billy-bookcase-white__0625599_pe692385_s5.jpg`,
  category: ["Living Room", "Bedroom", "Office"][i % 3],
}));

const MOCK_SCENE: AssemblyScene = {
  id: "scene-1",
  steps: Array.from({ length: 12 }).map((_, i) => ({
    id: `step-${i + 1}`,
    title: `Step ${i + 1}`,
    description: "Attach parts as shown and tighten screws.",
    parts: ["Side Panel", "Shelf", "Screw"].slice(0, (i % 3) + 1),
    tools: ["Screwdriver", "Hammer"].slice(0, (i % 2) + 1),
  })),
};

export async function fetchTopManuals(): Promise<Manual[]> {
  // Use embedded data for instant loading - no backend required!
  const { TOP_50_PRODUCTS } = await import('./top-50-data');
  return TOP_50_PRODUCTS;
  
  // Optional: Try to fetch from backend for fresh data (commented out for speed)
  /*
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    const response = await fetch(`${API_URL}/api/top-manuals`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      return await response.json();
    }
  } catch (error: any) {
    console.warn('Using embedded data (backend unavailable)');
  }
  
  return TOP_50_PRODUCTS;
  */
}

export async function searchManuals(query: string): Promise<Manual[]> {
  await new Promise((r) => setTimeout(r, 300));
  const q = query.toLowerCase();
  return MOCK_MANUALS.filter((m) => m.name.toLowerCase().includes(q));
}

export async function getAssemblyScene(manualId: string): Promise<AssemblyScene> {
  await new Promise((r) => setTimeout(r, 500));
  return { ...MOCK_SCENE, id: manualId };
}


