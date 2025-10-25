// Scene generator - converts Gemini analysis to 3D scene JSON
import { 
  AssemblyStep, 
  Part, 
  AssemblyAction, 
  Vector3, 
  Dimensions,
  GeminiStepAnalysis 
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
 * Converts Gemini's part descriptions to 3D part objects
 */
function generatePartsArray(analysis: GeminiStepAnalysis): Part[] {
  return analysis.partsUsed.map((part, index) => {
    const partType = part.type.toLowerCase()
    const dimensions = estimateDimensions(partType, part.estimatedDimensions)
    const color = getPartColor(part.material || 'metal', partType)
    const model = getPartModel(partType)
    
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
      model
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
 * Maps part types to 3D model paths
 */
function getPartModel(type: string): string {
  const modelMap: Record<string, string> = {
    screw: '/models/screw.glb',
    screw_flathead: '/models/screw.glb',
    screw_phillips: '/models/screw_phillips.glb',
    washer: '/models/washer.glb',
    bracket: '/models/bracket.glb',
    bracket_l: '/models/bracket_L.glb',
    dowel: '/models/dowel.glb',
    dowel_wood: '/models/dowel_wood.glb',
    cam_lock: '/models/cam_lock.glb',
    panel: '/models/panel.glb',
    board: '/models/board.glb',
    shelf: '/models/shelf.glb'
  }
  
  return modelMap[type] || '/models/generic_part.glb'
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

