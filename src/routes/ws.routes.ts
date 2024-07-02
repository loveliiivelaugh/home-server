import { Hono } from "hono";
import { Context } from "hono";


const websocketRoutes = new Hono();


websocketRoutes.get('/', async (c: Context) => {
    return c.text("ws success!")
});

export { websocketRoutes };