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
  scenePreset?: string;  // Maps to SCENE_LIBRARY preset names
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

const SCENE_PRESETS = [
  'insert_dowels',
  'attach_bracket_corner',
  'stack_panels_vertical',
  'attach_back_panel',
  'install_shelf',
  'attach_legs',
  'stack_panels_horizontal',
  'attach_bracket_center'
];

const MOCK_SCENE: AssemblyScene = {
  id: "scene-1",
  steps: Array.from({ length: 12 }).map((_, i) => ({
    id: `step-${i + 1}`,
    title: `Step ${i + 1}`,
    description: "Attach parts as shown and tighten screws.",
    parts: ["Side Panel", "Shelf", "Screw"].slice(0, (i % 3) + 1),
    tools: ["Screwdriver", "Hammer"].slice(0, (i % 2) + 1),
    scenePreset: SCENE_PRESETS[i % SCENE_PRESETS.length],
  })),
};

export async function fetchTopManuals(): Promise<Manual[]> {
  await new Promise((r) => setTimeout(r, 300));
  return MOCK_MANUALS.slice(0, 50);
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


