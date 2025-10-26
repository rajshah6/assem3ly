// Scene generator - converts Gemini analysis to 3D scene JSON with geometric primitives
import { 
  AssemblyStep, 
  Part, 
  AssemblyAction, 
  Vector3, 
  Dimensions,
  GeminiStepAnalysis,
  Geometry,
  GeometryType
} from './types'

/**
 * Generates a complete 3D scene from Gemini's step analysis
 * @param analysis - The analysis from Gemini
 * @param stepId - The current step number
 * @param previousSteps - All previously processed steps for cumulative positioning
 */
export function generateSceneFromAnalysis(
  analysis: GeminiStepAnalysis,
  stepId: number,
  previousSteps: AssemblyStep[] = []
): AssemblyStep {
  const parts = generatePartsArray(analysis, stepId, previousSteps)
  const assemblySequence = generateAssemblySequence(analysis, parts)
  const camera = generateCameraSettings(parts, previousSteps)
  const lighting = generateLightingSettings()
  
  return {
    stepId,
    title: analysis.title,
    description: analysis.description,
    parts,
    assemblySequence,
    camera,
    lighting
  }
}

/**
 * Converts Gemini's part descriptions to 3D part objects with geometric primitives
 * Positions parts cumulatively based on previous steps
 */
function generatePartsArray(
  analysis: GeminiStepAnalysis, 
  currentStepId: number,
  previousSteps: AssemblyStep[]
): Part[] {
  // Calculate assembly bounds from all previous parts
  const assemblyBounds = calculateAssemblyBounds(previousSteps)
  
  // Determine base offset for this step (build upward/outward)
  const baseOffset = calculateStepOffset(currentStepId, assemblyBounds, previousSteps)
  
  return analysis.partsUsed.map((part, index) => {
    const partType = part.type.toLowerCase()
    const dimensions = estimateDimensions(partType, part.estimatedDimensions)
    const color = getPartColor(part.material || 'metal', partType)
    const geometry = getPartGeometry(partType, dimensions)
    
    // Calculate position for this part based on:
    // 1. Step-specific offset (where this step builds)
    // 2. Part arrangement within the step
    // 3. Part type (e.g., screws go near connection points)
    const position = calculatePartPosition(
      partType,
      index,
      baseOffset,
      dimensions,
      analysis.partsUsed.length,
      previousSteps
    )
    
    return {
      id: `${partType}_${String(index + 1).padStart(2, '0')}`,
      name: part.name,
      type: partType,
      quantity: part.quantity,
      dimensions,
      material: part.material || 'metal',
      color,
      position,
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      geometry
    }
  })
}

/**
 * Calculates the bounding box of all previously assembled parts
 */
function calculateAssemblyBounds(previousSteps: AssemblyStep[]): {
  minX: number; maxX: number;
  minY: number; maxY: number;
  minZ: number; maxZ: number;
  centerX: number; centerY: number; centerZ: number;
} {
  if (previousSteps.length === 0) {
    return {
      minX: 0, maxX: 0,
      minY: 0, maxY: 0,
      minZ: 0, maxZ: 0,
      centerX: 0, centerY: 0, centerZ: 0
    }
  }

  let minX = Infinity, maxX = -Infinity
  let minY = Infinity, maxY = -Infinity
  let minZ = Infinity, maxZ = -Infinity

  previousSteps.forEach(step => {
    step.parts.forEach(part => {
      const halfWidth = (part.dimensions.width || 0.05) / 2
      const halfHeight = (part.dimensions.height || 0.05) / 2
      const halfDepth = (part.dimensions.depth || 0.05) / 2

      minX = Math.min(minX, part.position.x - halfWidth)
      maxX = Math.max(maxX, part.position.x + halfWidth)
      minY = Math.min(minY, part.position.y - halfHeight)
      maxY = Math.max(maxY, part.position.y + halfHeight)
      minZ = Math.min(minZ, part.position.z - halfDepth)
      maxZ = Math.max(maxZ, part.position.z + halfDepth)
    })
  })

  return {
    minX, maxX, minY, maxY, minZ, maxZ,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
    centerZ: (minZ + maxZ) / 2
  }
}

/**
 * Calculates the base offset for a new step based on assembly progress
 */
function calculateStepOffset(
  stepId: number,
  bounds: ReturnType<typeof calculateAssemblyBounds>,
  previousSteps: AssemblyStep[]
): Vector3 {
  // First step starts at origin
  if (previousSteps.length === 0) {
    return { x: 0, y: 0, z: 0 }
  }

  // Determine building direction based on step patterns
  // Most IKEA furniture builds up (Y) and out (X/Z)
  
  // Every few steps, offset in a different direction
  const buildPhase = Math.floor((stepId - 1) / 3)
  
  switch (buildPhase % 4) {
    case 0: // Build upward
      return { x: bounds.centerX, y: bounds.maxY + 0.05, z: bounds.centerZ }
    case 1: // Build forward
      return { x: bounds.centerX, y: bounds.centerY, z: bounds.maxZ + 0.1 }
    case 2: // Build to the side
      return { x: bounds.maxX + 0.1, y: bounds.centerY, z: bounds.centerZ }
    case 3: // Build backward
      return { x: bounds.centerX, y: bounds.centerY, z: bounds.minZ - 0.1 }
    default:
      return { x: bounds.centerX, y: bounds.maxY + 0.05, z: bounds.centerZ }
  }
}

/**
 * Calculates position for an individual part within a step
 */
function calculatePartPosition(
  partType: string,
  partIndex: number,
  baseOffset: Vector3,
  dimensions: Dimensions,
  totalPartsInStep: number,
  previousSteps: AssemblyStep[]
): Vector3 {
  // Small connectors (screws, washers) cluster near base
  if (isSmallConnector(partType)) {
    const angle = (partIndex / Math.max(totalPartsInStep - 1, 1)) * Math.PI * 2
    const radius = 0.08 // 8cm from base
    return {
      x: baseOffset.x + Math.cos(angle) * radius,
      y: baseOffset.y,
      z: baseOffset.z + Math.sin(angle) * radius
    }
  }

  // Large structural parts (panels, boards, legs)
  if (isStructuralPart(partType)) {
    // Offset slightly from base, arranged in a line
    const spacing = 0.15
    const offset = (partIndex - totalPartsInStep / 2) * spacing
    return {
      x: baseOffset.x + offset,
      y: baseOffset.y + (dimensions.height || 0.05) / 2,
      z: baseOffset.z
    }
  }

  // Medium parts (brackets, supports) - arrange in grid
  const gridCols = 3
  const spacing = 0.12
  const col = partIndex % gridCols
  const row = Math.floor(partIndex / gridCols)
  
  return {
    x: baseOffset.x + (col - 1) * spacing,
    y: baseOffset.y,
    z: baseOffset.z + row * spacing
  }
}

/**
 * Checks if part is a small connector (screw, washer, etc.)
 */
function isSmallConnector(partType: string): boolean {
  const connectors = ['screw', 'washer', 'bolt', 'nut', 'dowel', 'pin', 'cam']
  return connectors.some(type => partType.includes(type))
}

/**
 * Checks if part is a structural component (panel, leg, etc.)
 */
function isStructuralPart(partType: string): boolean {
  const structural = ['panel', 'board', 'shelf', 'leg', 'rail', 'frame', 'top', 'table']
  return structural.some(type => partType.includes(type))
}

/**
 * Estimates dimensions based on part type and description
 */
function estimateDimensions(partType: string, dimensionHint?: string): Dimensions {
  // Default dimensions for common IKEA parts (in meters)
  const defaults: Record<string, Dimensions> = {
    screw: { length: 0.04, radius: 0.004 },
    screw_flathead: { length: 0.04, radius: 0.004 },
    screw_phillips: { length: 0.04, radius: 0.004 },
    washer: { radius: 0.01, thickness: 0.002 },
    bracket: { width: 0.12, height: 0.05, depth: 0.02 },
    bracket_l: { width: 0.12, height: 0.05, depth: 0.02 },
    dowel: { length: 0.08, radius: 0.006 },
    dowel_wood: { length: 0.08, radius: 0.006 },
    cam_lock: { radius: 0.015, thickness: 0.01 },
    panel: { width: 0.5, height: 0.6, depth: 0.016 },
    board: { width: 0.5, height: 0.6, depth: 0.016 },
    shelf: { width: 0.5, height: 0.02, depth: 0.3 }
  }
  
  // Try to parse dimension hint if provided
  if (dimensionHint) {
    const parsed = parseDimensionString(dimensionHint)
    if (parsed) return parsed
  }
  
  // Return default or generic dimensions
  return defaults[partType] || { width: 0.05, height: 0.05, depth: 0.05 }
}

/**
 * Parses dimension strings like "0.04m x 0.02m" or "40mm x 20mm"
 */
function parseDimensionString(str: string): Dimensions | null {
  const patterns = [
    /(\d+\.?\d*)\s*m\s*x\s*(\d+\.?\d*)\s*m/i,
    /(\d+\.?\d*)\s*mm\s*x\s*(\d+\.?\d*)\s*mm/i,
    /(\d+\.?\d*)\s*cm\s*x\s*(\d+\.?\d*)\s*cm/i
  ]
  
  for (const pattern of patterns) {
    const match = str.match(pattern)
    if (match) {
      let val1 = parseFloat(match[1])
      let val2 = parseFloat(match[2])
      
      // Convert to meters
      if (str.includes('mm')) {
        val1 /= 1000
        val2 /= 1000
      } else if (str.includes('cm')) {
        val1 /= 100
        val2 /= 100
      }
      
      return { width: val1, depth: val2 }
    }
  }
  
  return null
}

/**
 * Returns appropriate color based on material and type
 */
function getPartColor(material: string, type: string): string {
  const colorMap: Record<string, string> = {
    metal: '#C0C0C0',
    steel: '#B8B8B8',
    aluminum: '#D4D4D4',
    wood: '#D2B48C',
    plastic: '#F0F0F0',
    black_metal: '#444444',
    white_plastic: '#FFFFFF'
  }
  
  // Special cases
  if (type.includes('screw')) return '#777777'
  if (type.includes('washer')) return '#AAAAAA'
  
  return colorMap[material.toLowerCase()] || '#CCCCCC'
}

/**
 * Maps part types to React Three Fiber geometric primitives
 */
function getPartGeometry(type: string, dimensions: Dimensions): Geometry {
  const typeNormalized = type.toLowerCase().replace(/[_-]/g, '')
  
  // Screws - Cylinder
  if (typeNormalized.includes('screw') || typeNormalized.includes('bolt')) {
    const radius = dimensions.radius || 0.004
    const height = dimensions.length || dimensions.height || 0.04
    return {
      type: 'cylinder',
      args: [radius, radius, height, 16]  // [radiusTop, radiusBottom, height, segments]
    }
  }
  
  // Washers - Torus (flat ring)
  if (typeNormalized.includes('washer') || typeNormalized.includes('ring')) {
    const radius = dimensions.radius || 0.01
    const tube = dimensions.thickness || 0.002
    return {
      type: 'torus',
      args: [radius, tube, 16, 32]  // [radius, tube, radialSegments, tubularSegments]
    }
  }
  
  // Dowels - Cylinder
  if (typeNormalized.includes('dowel') || typeNormalized.includes('pin')) {
    const radius = dimensions.radius || 0.006
    const height = dimensions.length || dimensions.height || 0.08
    return {
      type: 'cylinder',
      args: [radius, radius, height, 16]
    }
  }
  
  // Legs - Cylinder or Cone
  if (typeNormalized.includes('leg')) {
    const radius = dimensions.radius || 0.02
    const height = dimensions.height || dimensions.length || 0.7
    return {
      type: 'cylinder',
      args: [radius, radius, height, 16]
    }
  }
  
  // Brackets - Box (L-shaped approximation)
  if (typeNormalized.includes('bracket')) {
    const width = dimensions.width || 0.12
    const height = dimensions.height || 0.05
    const depth = dimensions.depth || 0.02
    return {
      type: 'box',
      args: [width, height, depth]  // [width, height, depth]
    }
  }
  
  // Panels, boards, shelves, tabletops - Box (thin rectangles)
  if (typeNormalized.includes('panel') || 
      typeNormalized.includes('board') || 
      typeNormalized.includes('shelf') ||
      typeNormalized.includes('top') ||
      typeNormalized.includes('table')) {
    const width = dimensions.width || 0.5
    const height = dimensions.height || dimensions.thickness || 0.02
    const depth = dimensions.depth || 0.3
    return {
      type: 'box',
      args: [width, height, depth]
    }
  }
  
  // Blocks - Box
  if (typeNormalized.includes('block') || typeNormalized.includes('cube')) {
    const width = dimensions.width || 0.05
    const height = dimensions.height || 0.05
    const depth = dimensions.depth || 0.05
    return {
      type: 'box',
      args: [width, height, depth]
    }
  }
  
  // Knobs, balls - Sphere
  if (typeNormalized.includes('knob') || 
      typeNormalized.includes('ball') ||
      typeNormalized.includes('sphere')) {
    const radius = dimensions.radius || 0.015
    return {
      type: 'sphere',
      args: [radius, 32, 32]  // [radius, widthSegments, heightSegments]
    }
  }
  
  // Cam locks - Cylinder (short and wide)
  if (typeNormalized.includes('cam') || typeNormalized.includes('lock')) {
    const radius = dimensions.radius || 0.015
    const thickness = dimensions.thickness || 0.01
    return {
      type: 'cylinder',
      args: [radius, radius, thickness, 16]
    }
  }
  
  // Default: Box with estimated dimensions
  const width = dimensions.width || dimensions.length || 0.05
  const height = dimensions.height || dimensions.thickness || 0.05
  const depth = dimensions.depth || 0.05
  
  return {
    type: 'box',
    args: [width, height, depth]
  }
}

/**
 * Generates assembly sequence from Gemini's action analysis
 */
function generateAssemblySequence(
  analysis: GeminiStepAnalysis,
  parts: Part[]
): AssemblyAction[] {
  const sequence: AssemblyAction[] = []
  
  analysis.actions.forEach((action, index) => {
    const targetPart = parts.find(p => 
      p.name.toLowerCase().includes(action.targetPart?.toLowerCase() || '')
    )
    
    if (!targetPart) return
    
    const actionType = mapActionType(action.action)
    const duration = 2.0 + index * 0.5
    
    if (actionType === 'move') {
      sequence.push({
        action: 'move',
        targetId: targetPart.id,
        from: { x: targetPart.position.x + 0.1, y: 0.1, z: targetPart.position.z },
        to: targetPart.position,
        duration
      })
    } else if (actionType === 'rotate') {
      sequence.push({
        action: 'rotate',
        targetId: targetPart.id,
        axis: 'y',
        angle: 720, // Two full rotations
        duration
      })
    }
  })
  
  return sequence
}

/**
 * Maps action descriptions to action types
 */
function mapActionType(action: string): 'move' | 'rotate' | 'attach' | 'insert' {
  const actionLower = action.toLowerCase()
  
  if (actionLower.includes('rotate') || actionLower.includes('turn') || actionLower.includes('screw')) {
    return 'rotate'
  }
  if (actionLower.includes('insert') || actionLower.includes('push')) {
    return 'insert'
  }
  if (actionLower.includes('attach') || actionLower.includes('connect') || actionLower.includes('join')) {
    return 'attach'
  }
  
  return 'move'
}

/**
 * Generates camera settings for optimal viewing
 * Takes into account both current step parts and entire assembly
 */
function generateCameraSettings(
  parts: Part[], 
  previousSteps: AssemblyStep[]
): { position: Vector3; lookAt: Vector3 } {
  // Calculate center of current step parts
  const center = { x: 0, y: 0, z: 0 }
  
  if (parts.length > 0) {
    parts.forEach(part => {
      center.x += part.position.x
      center.y += part.position.y
      center.z += part.position.z
    })
    center.x /= parts.length
    center.y /= parts.length
    center.z /= parts.length
  }
  
  // If we have previous steps, adjust camera to show overall assembly
  if (previousSteps.length > 0) {
    const bounds = calculateAssemblyBounds(previousSteps)
    // Look at the center of the overall assembly
    center.x = (center.x + bounds.centerX) / 2
    center.y = (center.y + bounds.centerY) / 2
    center.z = (center.z + bounds.centerZ) / 2
  }
  
  // Position camera at angle for good view
  // Distance increases as assembly grows
  const cameraDistance = 0.4 + previousSteps.length * 0.03
  
  return {
    position: { 
      x: center.x + cameraDistance * 0.75, 
      y: center.y + cameraDistance * 0.5, 
      z: center.z + cameraDistance 
    },
    lookAt: center
  }
}

/**
 * Generates standard lighting settings
 */
function generateLightingSettings() {
  return {
    ambient: { intensity: 0.5 },
    directional: { 
      intensity: 0.8, 
      position: { x: 1, y: 2, z: 3 } 
    }
  }
}

