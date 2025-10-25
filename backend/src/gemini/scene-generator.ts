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
 */
export function generateSceneFromAnalysis(
  analysis: GeminiStepAnalysis,
  stepId: number
): AssemblyStep {
  const parts = generatePartsArray(analysis)
  const assemblySequence = generateAssemblySequence(analysis, parts)
  const camera = generateCameraSettings(parts)
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
 */
function generatePartsArray(analysis: GeminiStepAnalysis): Part[] {
  return analysis.partsUsed.map((part, index) => {
    const partType = part.type.toLowerCase()
    const dimensions = estimateDimensions(partType, part.estimatedDimensions)
    const color = getPartColor(part.material || 'metal', partType)
    const geometry = getPartGeometry(partType, dimensions)
    
    // Position parts in a grid for now
    const gridX = (index % 3) * 0.15
    const gridZ = Math.floor(index / 3) * 0.15
    
    return {
      id: `${partType}_${String(index + 1).padStart(2, '0')}`,
      name: part.name,
      type: partType,
      quantity: part.quantity,
      dimensions,
      material: part.material || 'metal',
      color,
      position: { x: gridX, y: 0, z: gridZ },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      geometry
    }
  })
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
 */
function generateCameraSettings(parts: Part[]): { position: Vector3; lookAt: Vector3 } {
  // Calculate center of all parts
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
  
  // Position camera at angle for good view
  return {
    position: { x: center.x + 0.3, y: center.y + 0.2, z: center.z + 0.4 },
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

