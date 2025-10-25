import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import pdfProcessorRoute from './api/pdf-processor.route'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'assem3ly-backend' })
})

// API routes
app.use('/api', pdfProcessorRoute)

app.listen(PORT, () => {
  console.log(`🚀 assem3ly backend running on http://localhost:${PORT}`)
  console.log(`📡 API available at http://localhost:${PORT}/api`)
  console.log(`🔑 Gemini API Key: ${process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Not set'}`)
})

