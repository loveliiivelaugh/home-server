import { Hono } from 'hono'

// Middleware
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { basicAuth } from 'hono/basic-auth';
import { poweredBy } from 'hono/powered-by';
import { prettyJSON } from 'hono/pretty-json';
import { swaggerUI } from '@hono/swagger-ui';

// Database
import { basicAuthConfig, trustedSources } from '../config/clients.config';
import { initDatabase } from '../config/supabase.config';
import { createDatabaseMiddleware } from '../db';
import { authMiddleware } from '../middleware';

// Routes
import { routes } from './routes';


const port = Bun.env.PORT || 5001;

const app = new Hono();


// Middleware
app.use(logger());
app.use(poweredBy());
app.use(cors({ origin: trustedSources, credentials: true }));
app.use(prettyJSON({ space: 4 }));
app.use(basicAuth(basicAuthConfig));

// Database (For Production: Supabase *for now*)
app.use(createDatabaseMiddleware(initDatabase()));
// Connect to db before auth middleware for session across microservices
app.use(authMiddleware);

// Routes
app.route('/', routes);

// Use the middleware to serve Swagger UI at /ui
app.get('/ui', swaggerUI({ url: '/doc' }))

export default { port, fetch: app.fetch };
