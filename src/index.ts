import { Hono } from 'hono'

// Middleware
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { basicAuth } from 'hono/basic-auth';
import { poweredBy } from 'hono/powered-by';
import { prettyJSON } from 'hono/pretty-json';

// Routes
import { routes } from './routes';

interface BasicAuthConfig {
  username: string;
  password: string;
}

const port = Bun.env.PORT || 5001;

const app = new Hono()

const basicAuthConfig = <BasicAuthConfig>{
  username: Bun.env.BASIC_AUTH_USERNAME,
  password: Bun.env.BASIC_AUTH_PASSWORD,
};


// Middleware
app.use(logger());
app.use(poweredBy());
app.use(cors({ origin: ['*', 'https://familyapps.netlify.app', 'https://familyapps2.netlify.app'] }));
app.use(prettyJSON({ space: 4 }));
app.use(basicAuth(basicAuthConfig));

// Routes
app.route('/', routes);

export default { port, fetch: app.fetch };
