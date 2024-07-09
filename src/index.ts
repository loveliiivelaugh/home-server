import { Hono } from 'hono'
import { Context } from 'hono';

// Middleware
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { poweredBy } from 'hono/powered-by';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers'
import { showRoutes } from 'hono/dev'
import { createBunWebSocket } from 'hono/bun';
import { swaggerUI } from '@hono/swagger-ui';

import { verify } from 'hono/jwt';
import { getSignedCookie } from 'hono/cookie'

// Database
import { initDatabase } from '../config/supabase.config';
import { createDatabaseMiddleware } from '../db';

// Security + Config
import { authMiddleware } from '../middleware';
import { corsConfig, initApiClients } from '../config/clients.config';

// Routes
import { routes } from './routes';


// Server
const port = Bun.env.PORT || 5001;

const app = new Hono();

const { upgradeWebSocket, websocket } = createBunWebSocket();

// Middleware
app.use(logger());
app.use(poweredBy());
app.use(cors(corsConfig));
app.use(prettyJSON({ space: 4 }));
app.use(secureHeaders());

// Use the middleware to serve Swagger UI at /ui
app.get('/ui', swaggerUI({ url: '/doc' }));

// Websocket // *Experimental*
app.get('/ws', upgradeWebSocket((c) => {

    const events = {
        onMessage(event: any, ws: any) {
            const data = JSON.parse(event.data);
            console.info("Looking for video chunks: ", data);
            ws.send('Hello from server!')
        },
        onClose: () => {
            console.log('Connection closed')
        },
    };

    return events;
}));

// Security // Interferes with Bearer Auth
// app.use(basicAuth(basicAuthConfig));

// Database (For Production: Supabase *for now*)
app.use(createDatabaseMiddleware(initDatabase()));


app.get('/auth/v1/protected',  async (c: Context) => {
    // Retrieve the JWT from the cookie
    const token = await getSignedCookie(
        c,
        Bun.env.COOKIE_SIGNING_KEY as string,
        'token'
    );
    
    if (!token) {
        return c.json({ status: 'error', message: 'No token provided' }, 401);
    }

    try {
        const decoded = verify(token, Bun.env.JWT_SECRET as string); // Verify the JWT
        
        return c.json({ status: 'success', user: decoded });

    } catch (err) {
        return c.json({ status: 'error', message: 'Invalid token' }, 401);
    }
});

// More Security
// Connect to db before auth middleware for session across microservices
app.use(authMiddleware);

// Set up + authenticate External API Clients
app.use(initApiClients());

// Routes
app.route('/', routes);

showRoutes(app, {
    verbose: true
});

export default { 
    port, 
    fetch: app.fetch, 
    websocket
};
