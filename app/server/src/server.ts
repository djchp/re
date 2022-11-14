import { ApolloServer } from 'apollo-server-express'
import { createContext } from './context'
import {ApolloServerPluginDrainHttpServer} from 'apollo-server-core'
import { schema } from './schema'
import express from 'express'
import http from 'http'
import cors from 'cors'

const app = express()
app.use(cors({origin: ['https://react-site-tb37.onrender.com/']}))
// app.use(cors())

const startServer = async () => {
  const httpServer = http.createServer(app)
  const server = new ApolloServer({
    schema,
    context: createContext,
    plugins: [
      ApolloServerPluginDrainHttpServer({httpServer})
    ]
  })
  await server.start()
  server.applyMiddleware({app})
  const port = Number(process.env.PORT ?? 8080);
  await new Promise<void>((resolve) =>
    httpServer.listen({ host: '0.0.0.0', port }, resolve)
  );
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  );
}
startServer()