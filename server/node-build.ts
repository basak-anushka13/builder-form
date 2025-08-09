import { createServer } from './index'

const startServer = async () => {
  const app = await createServer()
  const PORT = process.env.PORT || 3000
  
  app.listen(PORT, () => {
    console.log(`FormCraft server running on port ${PORT}`)
  })
}

startServer().catch(console.error)
