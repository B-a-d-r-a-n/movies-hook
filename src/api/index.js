const jsonServer = require('json-server')
const path = require('path')

// The path needs to be resolved to the location of db.json at runtime
const dbPath = path.resolve(process.cwd(), 'db.json')

const server = jsonServer.create()
const router = jsonServer.router(dbPath)
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(router)

// Export the server for Vercel's environment
module.exports = server
