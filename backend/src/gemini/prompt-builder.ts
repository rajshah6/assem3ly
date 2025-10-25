// Prompt builder for Gemini API - generates context-aware prompts
import { ProductMetadata } from './types'

/**
 * Builds a comprehensive prompt for Gemini to analyze an assembly step
 */
export function buildStepAnalysisPrompt(
  pageNumber: number,
  totalPages: number,
  metadata?: ProductMetadata
): string {
  const productInfo = metadata?.productName 
    ? `You are analyzing an IKEA assembly manual for: ${metadata.productName}\n`
    : 'You are analyzing an IKEA assembly manual.\n'
  
  const dimensionsInfo = metadata?.productDimensions
    ? `Product Dimensions: ${metadata.productDimensions.width} × ${metadata.productDimensions.height} × ${metadata.productDimensions.depth} (W×H×D)\n`
    : ''
  
  return `${productInfo}${dimensionsInfo}
Current Page: ${pageNumber}/${totalPages}

Analyze this assembly step image and extract detailed information in JSON format.

You must return a JSON object with this EXACT structure:
{
  "stepNumber": <number>,
  "title": "<short title>",
  "description": "<detailed 1-2 sentence instruction>",
  "partsUsed": [
    {
      "name": "<part name>",
      "type": "<part type: screw, bracket, panel, dowel, etc>",
      "quantity": <number>,
      "estimatedDimensions": "<approximate size in meters, e.g. '0.04m x 0.02m'>",
      "material": "<metal, wood, plastic, etc>"
    }
  ],
  "tools": ["<tool name>", ...],
  "actions": [
    {
      "action": "<move, rotate, attach, insert, tighten>",
      "description": "<what happens>",
      "targetPart": "<which part is being acted upon>"
    }
  ]
}

Guidelines:
1. Identify the step number shown in the image
2. Write a clear, actionable instruction
3. List ALL visible parts being used in this specific step
4. Estimate dimensions based on typical IKEA hardware (screws ~0.04m, brackets ~0.1m, etc)
5. Identify required tools (screwdriver, Allen key, hammer, etc)
6. Break down the action sequence (what moves where, what rotates, what attaches)
7. Be specific about part types (flathead screw, L-bracket, wooden dowel, etc)

Return ONLY valid JSON. No markdown formatting, no code blocks, no additional text.`
}

/**
 * Builds a prompt for the first page (often shows parts list)
 */
export function buildPartsListPrompt(): string {
  return `Analyze this IKEA assembly manual page. This appears to be a parts/hardware list.

Extract all parts shown and return a JSON object:
{
  "isPartsList": true,
  "parts": [
    {
      "name": "<part name or ID>",
      "type": "<screw, bracket, panel, etc>",
      "quantity": <total quantity provided>,
      "description": "<brief description>"
    }
  ]
}

If this is NOT a parts list page but an actual assembly step, return:
{
  "isPartsList": false
}

Return ONLY valid JSON.`
}

/**
 * Extracts step number from common IKEA numbering formats
 */
export function extractStepNumber(text: string): number | null {
  // Common patterns: "1.", "Step 1", "1/12", etc
  const patterns = [
    /step\s*(\d+)/i,
    /^(\d+)\./,
    /^(\d+)\s*$/,
    /^(\d+)\//
  ]
  
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) {
      return parseInt(match[1], 10)
    }
  }
  
  return null
}

