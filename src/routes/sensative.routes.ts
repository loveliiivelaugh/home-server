import { Hono } from 'hono';
import { Context } from 'hono';


const sensativeRoutes = new Hono();


sensativeRoutes
    .get('/', async (c: Context) => {
        const { sensativeClient } = c.var.clients;
        const endpoint = (c.req.query('endpoint') || "");

        console.info("sensativeRoutes:GET --> ", endpoint)

        let allowablePaths = [
            "/api/v1/ollama/available-models",
            "/api/privategpt/list-ingested-files"
        ];

        if (allowablePaths.includes(endpoint)) try {
            const data = (await sensativeClient.get(endpoint)).data;

            return c.json(data);

        } catch (error: any) {

            return c.json(error);
        }
        else return c.json('Path not allowed');
    })
    .post('/', async (c: Context) => {
        const { sensativeClient } = c.var.clients;
        const endpoint = (c.req.query('endpoint') || "");
        const payload = await c.req.json();

        console.info("sensativeRoutes:POST --> ", endpoint, payload)

        let allowablePaths = [
            "/api/aichat/postChat"
        ];

        if (allowablePaths.includes(endpoint)) try {
            const data = (await sensativeClient.post(endpoint, payload)).data;

            return c.json(data);

        } catch (error: any) {
            
            return c.json(error);
        }
        else return c.json('Path not allowed');
    });


export { sensativeRoutes }