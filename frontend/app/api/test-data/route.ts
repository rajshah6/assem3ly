import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    // Read the example_all_data.json from backend directory
    const filePath = path.join(process.cwd(), '..', 'backend', 'example_all_data.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContents)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error reading test data:', error)
    return NextResponse.json(
      { error: 'Failed to load test data' },
      { status: 500 }
    )
  }
}

