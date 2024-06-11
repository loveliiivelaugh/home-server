// Packages
import { createMiddleware } from 'hono/factory';

// Models
import * as schema from './schemas';


const createDatabaseMiddleware = (db: any) => createMiddleware(async (c, next) => {
  c.set('db', db);
  await next();
});


export { schema, createDatabaseMiddleware };