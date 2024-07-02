import { Hono } from 'hono'

// Middleware
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { poweredBy } from 'hono/powered-by';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers'
// import { createBunWebSocket } from 'hono/bun';
// import { swaggerUI } from '@hono/swagger-ui';

// Database
import { initDatabase } from '../config/supabase.config';
import { createDatabaseMiddleware } from '../db';

// Security + Config
import { authMiddleware } from '../middleware';
import { corsConfig, initApiClients } from '../config/clients.config';

// Routes
import { routes } from './routes';


// TODO: Add Websocket Support
// const { upgradeWebSocket, websocket } = createBunWebSocket();

const port = Bun.env.PORT || 5001;

const app = new Hono();


// Middleware
app.use(logger());
app.use(poweredBy());
app.use(cors(corsConfig));
app.use(prettyJSON({ space: 4 }));
app.use(secureHeaders());

// TODO: Add Swagger UI
// // Use the middleware to serve Swagger UI at /ui
// app.get('/ui', swaggerUI({ url: '/doc' }));

// // Websocket // *Experimental*
// app.get('/ws', upgradeWebSocket((c) => {

//     const events = {
//         onMessage(event: any, ws: any) {
//             // const data = JSON.parse(event.data);
//             // console.info(`Message from client: ${data.timestamp}`)
//             // console.info(`App ID: ${data.id}\nApp Name: ${data.appID}`)
//             // console.info(`Session ID: ${data.sessionID}`)
//             ws.send('Hello from server!')
//         },
//         onClose: () => {
//             console.log('Connection closed')
//         },
//     };

//     return events;
// }));

// Security // Interferes with Bearer Auth
// app.use(basicAuth(basicAuthConfig));

// Database (For Production: Supabase *for now*)
app.use(createDatabaseMiddleware(initDatabase()));

// More Security
// Connect to db before auth middleware for session across microservices
app.use(authMiddleware);

// Set up + authenticate External API Clients
app.use(initApiClients());

// Routes
app.route('/', routes);


export default { 
    port, 
    fetch: app.fetch, 
    // websocket 
};
