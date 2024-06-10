import { Hono } from 'hono'

// Middleware
import { logger } from 'hono/logger';
// import { basicAuth } from 'hono/basic-auth';
import { poweredBy } from 'hono/powered-by';
import { prettyJSON } from 'hono/pretty-json';

// Routes
import { routes } from './routes';

const port = Bun.env.PORT || 5001;

const app = new Hono()


// Middleware
app.use(poweredBy());
app.use(logger());
app.use(prettyJSON({ space: 4 }));

// Routes
app.route('/', routes);

export default { port, fetch: app.fetch };
