import { Hono } from 'hono';
import { Context } from 'hono';

import { handleAdminOnly } from '../../middleware';


const sensativeRoutes = new Hono();

sensativeRoutes
    .get('/', handleAdminOnly, async (c: Context) => {
        const { sensativeClient } = c.var.clients;
        const endpoint = (c.req.query('endpoint') || "");

        console.info("sensativeRoutes:GET --> ", endpoint)

        let allowablePaths = [
            "/api/v1/ollama/available-models",
            "/api/privategpt/list-ingested-files",
            "/api/github",
            "/database/read_schema",
            "/database/read_db",
            "/database/read_one_row",
            "/api/v1/local"
        ];

        if (allowablePaths.includes(endpoint) || allowablePaths.some(path => endpoint.startsWith(path))) try {
            const data = (await sensativeClient.get(endpoint)).data;

            return c.json(data);

        } catch (error: any) {

            return c.json(error);
        }
        else return c.json('Path not allowed');
    })
    .post('/', handleAdminOnly, async (c: Context) => {
        const { sensativeClient } = c.var.clients;
        const endpoint = (c.req.query('endpoint') || "");
        const payload = await c.req.json();

        console.info("sensativeRoutes:POST --> ", endpoint, payload)

        let allowablePaths = [
            "/api/aichat/postChat",
            "/api/v1/camera/document",
            "/database/create_row",
            "/database/write_db",
        ];

        if (allowablePaths.includes(endpoint) || allowablePaths.some(path => endpoint.startsWith(path))) try {
            const data = (await sensativeClient.post(endpoint, payload)).data;

            return c.json(data);

        } catch (error: any) {
            
            return c.json(error);
        }
        else return c.json('Path not allowed');
    });


export { sensativeRoutes }