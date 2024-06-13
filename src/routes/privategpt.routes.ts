import { Hono } from "hono";
import { Context } from "hono";

// import { privateGptScripts } from "../scripts/privateGpt.scripts";

const privateGptRoutes = new Hono();


privateGptRoutes.get('/list-ingested-files', async (c: Context) => {
    try {
        // const { privateGptClient } = c.var.clients;
        // const data = await privateGptScripts.list_ingested(privateGptClient);
        const data: [] = [];

        return c.json(data);

    } catch (error: any) {

        return c.json(error || 'Something went wrong');
    }
});


export { privateGptRoutes }