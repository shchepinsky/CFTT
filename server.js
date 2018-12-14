const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const { send404 } = require ('./utils')

const cors = require('cors')
const PORT = 80
const clientRoot = path.join('client', 'build')
const clientStatic = path.join(clientRoot, 'static')
const article = require('./api/articles')
const paragraph = require('./api/paragraphs')
const suggestions = require('./api/suggestions')

require('./database')

async function main () {
  const app = express()

  app.get('*', (req, res, next) => {
    console.log(req.url)
    next()
  })

  app.use(cors({
    origin: '*',
    allowedHeaders: 'content-type',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
  }))

  app.use(bodyParser.json())

  app.use('/fb', express.static(clientRoot))
  app.use('/static', express.static(clientStatic))

  app.get('/api/articles', article.get)
  app.get('/api/articles/:id', article.getById)

  app.delete('/api/articles', article.del)
  app.delete('/api/articles/:id', article.delById)

  app.get('/api/paragraphs/parse', paragraph.parse)
  app.get('/api/paragraphs', paragraph.get)
  app.get('/api/paragraphs/:id', paragraph.getById)

  app.get('/api/suggestions', suggestions.get)
  app.post('/api/suggestions', suggestions.post)

  // default to 404 error handler
  app.use((err, req, res) => {
    return send404(res)
  })

  app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
}

main().then()
