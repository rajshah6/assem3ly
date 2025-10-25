import express from 'express'
import cors from 'cors'
import 'dotenv/config'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'assem3ly-backend' })
})

// TODO: Add your API routes here

app.listen(PORT, () => {
  console.log(`🚀 assem3ly backend running on http://localhost:${PORT}`)
})

