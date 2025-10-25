/**
 * Scene Preset Library for 3D Assembly Viewer
 * Uses geometric primitives (boxes, cylinders, spheres) instead of GLB models
 */

export interface PrimitivePart {
  type: 'box' | 'cylinder' | 'sphere'
  color: string
  args: number[]  // Geometry arguments (varies by type)
  position: [number, number, number]
  rotation: [number, number, number]
  scale?: [number, number, number]
}

export interface ScenePreset {
  parts: PrimitivePart[]
  camera: {
    position: [number, number, number]
    lookAt: [number, number, number]
  }
}

export const SCENE_LIBRARY: Record<string, ScenePreset> = {
  // ═══════════════════════════════════════════════════
  // SCENE 1: Insert Dowels into Panel
  // ═══════════════════════════════════════════════════
  insert_dowels: {
    parts: [
      {
        type: 'box',
        color: '#d4a574',  // Wood panel
        args: [1, 0.02, 0.8],  // width, height, depth
        position: [0, 0, 0],
        rotation: [Math.PI / 2, 0, 0]  // Lay flat
      },
      {
        type: 'cylinder',
        color: '#deb887',  // Dowel 1 (top-left)
        args: [0.01, 0.01, 0.05, 16],  // radiusTop, radiusBottom, height, segments
        position: [-0.3, 0.05, -0.2],
        rotation: [0, 0, 0]
      },
      {
        type: 'cylinder',
        color: '#deb887',  // Dowel 2 (top-right)
        args: [0.01, 0.01, 0.05, 16],
        position: [0.3, 0.05, -0.2],
        rotation: [0, 0, 0]
      },
      {
        type: 'cylinder',
        color: '#deb887',  // Dowel 3 (bottom-left)
        args: [0.01, 0.01, 0.05, 16],
        position: [-0.3, 0.05, 0.2],
        rotation: [0, 0, 0]
      },
      {
        type: 'cylinder',
        color: '#deb887',  // Dowel 4 (bottom-right)
        args: [0.01, 0.01, 0.05, 16],
        position: [0.3, 0.05, 0.2],
        rotation: [0, 0, 0]
      }
    ],
    camera: {
      position: [1.2, 1.5, 1.2],
      lookAt: [0, 0, 0]
    }
  },

  // ═══════════════════════════════════════════════════
  // SCENE 2: Attach Bracket to Corner
  // ═══════════════════════════════════════════════════
  attach_bracket_corner: {
    parts: [
      {
        type: 'box',
        color: '#d4a574',  // Base panel
        args: [1, 0.02, 0.8],
        position: [0, 0, 0],
        rotation: [Math.PI / 2, 0, 0]
      },
      {
        type: 'box',
        color: '#a9a9a9',  // L-bracket (vertical part)
        args: [0.05, 0.12, 0.02],
        position: [-0.4, 0.06, -0.35],
        rotation: [0, 0, 0]
      },
      {
        type: 'box',
        color: '#a9a9a9',  // L-bracket (horizontal part)
        args: [0.05, 0.02, 0.12],
        position: [-0.4, 0.01, -0.3],
        rotation: [0, 0, 0]
      },
      {
        type: 'cylinder',
        color: '#808080',  // Screw 1
        args: [0.004, 0.004, 0.04, 16],
        position: [-0.4, 0.08, -0.35],
        rotation: [Math.PI / 2, 0, 0]
      },
      {
        type: 'cylinder',
        color: '#808080',  // Screw 2
        args: [0.004, 0.004, 0.04, 16],
        position: [-0.4, 0.04, -0.35],
        rotation: [Math.PI / 2, 0, 0]
      }
    ],
    camera: {
      position: [1.5, 1.2, 1.5],
      lookAt: [-0.4, 0, -0.35]
    }
  },

  // ═══════════════════════════════════════════════════
  // SCENE 3: Stack Panels Vertically
  // ═══════════════════════════════════════════════════
  stack_panels_vertical: {
    parts: [
      {
        type: 'box',
        color: '#d4a574',  // Panel 1 (standing)
        args: [1, 0.02, 0.8],
        position: [0, 0.4, 0],
        rotation: [0, 0, 0]
      },
      {
        type: 'box',
        color: '#d4a574',  // Panel 2 (standing behind)
        args: [1, 0.02, 0.8],
        position: [0, 0.4, 0.5],
        rotation: [0, 0, 0]
      },
      {
        type: 'cylinder',
        color: '#696969',  // Cam lock connector
        args: [0.015, 0.015, 0.01, 32],
        position: [0, 0.6, 0.25],
        rotation: [Math.PI / 2, 0, 0]
      },
      {
        type: 'cylinder',
        color: '#696969',  // Cam lock connector 2
        args: [0.015, 0.015, 0.01, 32],
        position: [0, 0.2, 0.25],
        rotation: [Math.PI / 2, 0, 0]
      }
    ],
    camera: {
      position: [2, 1, 2],
      lookAt: [0, 0.5, 0.25]
    }
  },

  // ═══════════════════════════════════════════════════
  // SCENE 4: Attach Back Panel
  // ═══════════════════════════════════════════════════
  attach_back_panel: {
    parts: [
      {
        type: 'box',
        color: '#d4a574',  // Side panel 1
        args: [0.02, 0.8, 0.4],
        position: [-0.5, 0.4, 0],
        rotation: [0, 0, 0]
      },
      {
        type: 'box',
        color: '#d4a574',  // Side panel 2
        args: [0.02, 0.8, 0.4],
        position: [0.5, 0.4, 0],
        rotation: [0, 0, 0]
      },
      {
        type: 'box',
        color: '#c4b5a0',  // Back panel (thinner, lighter)
        args: [1, 0.01, 0.8],
        position: [0, 0.4, 0.2],
        rotation: [0, 0, 0]
      },
      {
        type: 'cylinder',
        color: '#808080',  // Small nail/tack
        args: [0.002, 0.002, 0.015, 8],
        position: [-0.3, 0.6, 0.205],
        rotation: [0, 0, Math.PI / 2]
      },
      {
        type: 'cylinder',
        color: '#808080',  // Small nail/tack
        args: [0.002, 0.002, 0.015, 8],
        position: [0.3, 0.6, 0.205],
        rotation: [0, 0, Math.PI / 2]
      }
    ],
    camera: {
      position: [2, 1.5, 2],
      lookAt: [0, 0.4, 0]
    }
  },

  // ═══════════════════════════════════════════════════
  // SCENE 5: Install Shelf
  // ═══════════════════════════════════════════════════
  install_shelf: {
    parts: [
      {
        type: 'box',
        color: '#d4a574',  // Left side panel
        args: [0.02, 1.2, 0.4],
        position: [-0.4, 0.6, 0],
        rotation: [0, 0, 0]
      },
      {
        type: 'box',
        color: '#d4a574',  // Right side panel
        args: [0.02, 1.2, 0.4],
        position: [0.4, 0.6, 0],
        rotation: [0, 0, 0]
      },
      {
        type: 'box',
        color: '#d4a574',  // Shelf board
        args: [0.8, 0.02, 0.35],
        position: [0, 0.5, 0],
        rotation: [0, 0, 0]
      },
      {
        type: 'cylinder',
        color: '#deb887',  // Shelf pin 1
        args: [0.008, 0.008, 0.025, 12],
        position: [-0.39, 0.5, 0.1],
        rotation: [0, 0, Math.PI / 2]
      },
      {
        type: 'cylinder',
        color: '#deb887',  // Shelf pin 2
        args: [0.008, 0.008, 0.025, 12],
        position: [-0.39, 0.5, -0.1],
        rotation: [0, 0, Math.PI / 2]
      },
      {
        type: 'cylinder',
        color: '#deb887',  // Shelf pin 3
        args: [0.008, 0.008, 0.025, 12],
        position: [0.39, 0.5, 0.1],
        rotation: [0, 0, Math.PI / 2]
      },
      {
        type: 'cylinder',
        color: '#deb887',  // Shelf pin 4
        args: [0.008, 0.008, 0.025, 12],
        position: [0.39, 0.5, -0.1],
        rotation: [0, 0, Math.PI / 2]
      }
    ],
    camera: {
      position: [1.8, 1.2, 1.8],
      lookAt: [0, 0.5, 0]
    }
  },

  // ═══════════════════════════════════════════════════
  // SCENE 6: Attach Legs
  // ═══════════════════════════════════════════════════
  attach_legs: {
    parts: [
      {
        type: 'box',
        color: '#d4a574',  // Table top
        args: [1.2, 0.03, 0.8],
        position: [0, 0.5, 0],
        rotation: [0, 0, 0]
      },
      {
        type: 'cylinder',
        color: '#3d3d3d',  // Leg 1 (front-left)
        args: [0.025, 0.025, 0.5, 16],
        position: [-0.5, 0.25, -0.35],
        rotation: [0, 0, 0]
      },
      {
        type: 'cylinder',
        color: '#3d3d3d',  // Leg 2 (front-right)
        args: [0.025, 0.025, 0.5, 16],
        position: [0.5, 0.25, -0.35],
        rotation: [0, 0, 0]
      },
      {
        type: 'cylinder',
        color: '#3d3d3d',  // Leg 3 (back-left)
        args: [0.025, 0.025, 0.5, 16],
        position: [-0.5, 0.25, 0.35],
        rotation: [0, 0, 0]
      },
      {
        type: 'cylinder',
        color: '#3d3d3d',  // Leg 4 (back-right)
        args: [0.025, 0.025, 0.5, 16],
        position: [0.5, 0.25, 0.35],
        rotation: [0, 0, 0]
      },
      {
        type: 'cylinder',
        color: '#808080',  // Screw for leg 1
        args: [0.005, 0.005, 0.03, 12],
        position: [-0.5, 0.515, -0.35],
        rotation: [0, 0, 0]
      }
    ],
    camera: {
      position: [2, 1.5, 2],
      lookAt: [0, 0.3, 0]
    }
  },

  // ═══════════════════════════════════════════════════
  // SCENE 7: Stack Panels Horizontally
  // ═══════════════════════════════════════════════════
  stack_panels_horizontal: {
    parts: [
      {
        type: 'box',
        color: '#d4a574',  // Bottom panel
        args: [1, 0.02, 0.5],
        position: [0, 0, 0],
        rotation: [Math.PI / 2, 0, 0]
      },
      {
        type: 'box',
        color: '#d4a574',  // Top panel
        args: [1, 0.02, 0.5],
        position: [0, 0.3, 0],
        rotation: [Math.PI / 2, 0, 0]
      },
      {
        type: 'cylinder',
        color: '#deb887',  // Dowel connector 1
        args: [0.01, 0.01, 0.28, 16],
        position: [-0.35, 0.15, -0.15],
        rotation: [0, 0, 0]
      },
      {
        type: 'cylinder',
        color: '#deb887',  // Dowel connector 2
        args: [0.01, 0.01, 0.28, 16],
        position: [0.35, 0.15, -0.15],
        rotation: [0, 0, 0]
      },
      {
        type: 'cylinder',
        color: '#deb887',  // Dowel connector 3
        args: [0.01, 0.01, 0.28, 16],
        position: [-0.35, 0.15, 0.15],
        rotation: [0, 0, 0]
      },
      {
        type: 'cylinder',
        color: '#deb887',  // Dowel connector 4
        args: [0.01, 0.01, 0.28, 16],
        position: [0.35, 0.15, 0.15],
        rotation: [0, 0, 0]
      }
    ],
    camera: {
      position: [1.5, 1.2, 1.5],
      lookAt: [0, 0.15, 0]
    }
  },

  // ═══════════════════════════════════════════════════
  // SCENE 8: Attach Center Bracket
  // ═══════════════════════════════════════════════════
  attach_bracket_center: {
    parts: [
      {
        type: 'box',
        color: '#d4a574',  // Base panel
        args: [1.2, 0.02, 0.6],
        position: [0, 0, 0],
        rotation: [Math.PI / 2, 0, 0]
      },
      {
        type: 'box',
        color: '#a9a9a9',  // Center bracket (vertical)
        args: [0.08, 0.15, 0.02],
        position: [0, 0.075, 0],
        rotation: [0, 0, 0]
      },
      {
        type: 'box',
        color: '#a9a9a9',  // Center bracket (horizontal)
        args: [0.08, 0.02, 0.15],
        position: [0, 0.01, 0.065],
        rotation: [0, 0, 0]
      },
      {
        type: 'cylinder',
        color: '#808080',  // Screw 1
        args: [0.005, 0.005, 0.04, 16],
        position: [0, 0.1, 0],
        rotation: [Math.PI / 2, 0, 0]
      },
      {
        type: 'cylinder',
        color: '#808080',  // Screw 2
        args: [0.005, 0.005, 0.04, 16],
        position: [0, 0.05, 0],
        rotation: [Math.PI / 2, 0, 0]
      }
    ],
    camera: {
      position: [1.2, 1, 1.2],
      lookAt: [0, 0.05, 0]
    }
  },

  // ═══════════════════════════════════════════════════
  // FALLBACK: Generic Assembly View
  // ═══════════════════════════════════════════════════
  generic_assembly: {
    parts: [
      {
        type: 'box',
        color: '#cccccc',
        args: [0.5, 0.5, 0.5],
        position: [0, 0.25, 0],
        rotation: [0, Math.PI / 4, 0]
      },
      {
        type: 'sphere',
        color: '#999999',
        args: [0.15, 32, 32],
        position: [0, 0.6, 0],
        rotation: [0, 0, 0]
      }
    ],
    camera: {
      position: [1.5, 1.5, 1.5],
      lookAt: [0, 0.25, 0]
    }
  }
}

/**
 * Get a scene preset by name, with fallback to generic_assembly
 */
export function getScenePreset(presetName?: string): ScenePreset {
  if (!presetName || !SCENE_LIBRARY[presetName]) {
    return SCENE_LIBRARY.generic_assembly
  }
  return SCENE_LIBRARY[presetName]
}

/**
 * Get list of all available scene preset names
 */
export function getAvailableScenePresets(): string[] {
  return Object.keys(SCENE_LIBRARY).filter(key => key !== 'generic_assembly')
}

