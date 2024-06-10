import { Hono } from 'hono'

// Middleware
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { basicAuth } from 'hono/basic-auth';
import { poweredBy } from 'hono/powered-by';
import { prettyJSON } from 'hono/pretty-json';

// Routes
import { routes } from './routes';

const port = Bun.env.PORT || 5001;

const app = new Hono()

const basicAuthConfig = {
  username: Bun.env.BASIC_AUTH_USERNAME || 'hono',
  password: Bun.env.BASIC_AUTH_PASSWORD || 'acoolproject',
}


// Middleware
app.use(logger());
app.use(poweredBy());
app.use(cors({ origin: '*' }));
app.use(prettyJSON({ space: 4 }));
app.use(basicAuth(basicAuthConfig));

// Routes
app.route('/', routes);

export default { port, fetch: app.fetch };
