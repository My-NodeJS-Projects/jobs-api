require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()

// error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
const authenticationMiddleware = require('./middleware/authentication')

//routers
const authRouter = require('./routes/auth')
const jobRouter = require('./routes/jobs')

//security packages
const cors = require('cors')
const xss = require('xss-clean')
const helmet = require('helmet')
const rateLimiter = require('express-rate-limit')

//swagger
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')

const swaggerDoc = YAML.load('./swagger.yaml')

app.use(express.json())
app.use(cors())
app.use(xss())
app.use(helmet())

app.set('trust proxy', 1)

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
)

const connectDB = require('./db/connect')

// routes
app.get('/', (req, res) => {
  res.send('<h1>Jobs API </h1> <a href="/api-docs">Documentation</a>')
})
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc))
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authenticationMiddleware, jobRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    console.log('Database connected')
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    )
  } catch (error) {
    console.log(error)
  }
}

start()
