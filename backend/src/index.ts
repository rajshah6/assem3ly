import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import pdfProcessorRoute from './api/pdf-processor.route'
import routes from './api/routes'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'assem3ly-backend' })
})

// API routes
app.use('/api', routes)
app.use('/api', pdfProcessorRoute)

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Server Error:', err.message)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

app.listen(PORT, () => {
  console.log('\n' + '🚀 '.repeat(30))
  console.log('🚀 assem3ly backend running')
  console.log('📍 Server: http://localhost:' + PORT)
  console.log('🌐 API: http://localhost:' + PORT + '/api')
  console.log('💚 Health: http://localhost:' + PORT + '/health')
  console.log('🚀 '.repeat(30) + '\n')
  console.log(`📡 API available at http://localhost:${PORT}/api`)
  console.log(`🔑 Gemini API Key: ${process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Not set'}`)
})

