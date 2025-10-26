// Type definitions for assembly step extraction and 3D scene generation

export interface Vector3 {
  x: number
  y: number
  z: number
}

export interface Dimensions {
  width?: number
  height?: number
  depth?: number
  length?: number
  radius?: number
  thickness?: number
  radiusTop?: number
  radiusBottom?: number
  innerRadius?: number
  outerRadius?: number
  tube?: number
}

// Geometry types for React Three Fiber
export type GeometryType = 
  | 'box'           // Rectangular box
  | 'cylinder'      // Cylindrical shape (screws, dowels, legs)
  | 'sphere'        // Spherical shape (knobs, balls)
  | 'torus'         // Ring/washer shape
  | 'cone'          // Conical shape
  | 'capsule'       // Rounded cylinder
  | 'plane'         // Flat rectangular plane

export interface Geometry {
  type: GeometryType
  // For box: width, height, depth
  // For cylinder: radius, height
  // For sphere: radius
  // For torus: radius (outer), tube (thickness)
  // For cone: radius, height
  args: number[]  // Arguments array for React Three Fiber geometry
}

export interface Part {
  id: string
  name: string
  type: string
  quantity: number
  dimensions: Dimensions
  material: string
  color: string
  position: Vector3
  rotation: Vector3
  scale: Vector3
  geometry: Geometry  // Describes the 3D shape to generate
}

export interface AssemblyAction {
  action: 'move' | 'rotate' | 'attach' | 'insert'
  targetId: string
  from?: Vector3
  to?: Vector3
  axis?: 'x' | 'y' | 'z'
  angle?: number
  duration: number
}

export interface CameraSettings {
  position: Vector3
  lookAt: Vector3
}

export interface LightingSettings {
  ambient: {
    intensity: number
  }
  directional: {
    intensity: number
    position: Vector3
  }
}

export interface AssemblyStep {
  stepId: number
  title: string
  description: string
  parts: Part[]
  assemblySequence: AssemblyAction[]
  camera: CameraSettings
  lighting: LightingSettings
}

// Gemini API Response structure
export interface GeminiStepAnalysis {
  stepNumber: number
  title: string
  description: string
  partsUsed: Array<{
    name: string
    type: string
    quantity: number
    estimatedDimensions?: string
    material?: string
  }>
  tools?: string[]
  actions: Array<{
    action: string
    description: string
    targetPart?: string
  }>
}

// Metadata from scraped IKEA product
export interface ProductMetadata {
  productName?: string
  productDimensions?: {
    width?: number
    height?: number
    depth?: number
  }
  category?: string
  parts?: string[]
}

// PDF Processing result
export interface ProcessedPDF {
  totalPages: number
  steps: AssemblyStep[]
  metadata?: ProductMetadata
}

