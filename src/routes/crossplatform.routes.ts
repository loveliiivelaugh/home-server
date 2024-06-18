import { Hono } from "hono";
import { Context } from "hono";

import { schema } from "../../db";


const crossPlatformRoutes = new Hono();

crossPlatformRoutes
    .get('/', async (c: Context) => {
        const { db } = c.var;

        try {
            const result = await db
                .query
                .cross_platform_apps
                .findMany();

            return c.json(result);

        } catch (error: any) {

            return c.json(error);
        }
    })
    
    .post('/', async (c: Context) => {
        const { db } = c.var;
        const { sensativeClient } = c.var.clients;
        const data = await c.req.json();
        
        try {

            console.log("crossplatform.routes.post: ", data)
            // use the data to add a new message to a chat ...
            // ... when sending an image from camera to aichat
            if (
                (data.appId === "camera") 
                && (data.data.crossPlatformState.appId === "AI")
            ) {
                const payload = {
                    id: data.data.crossPlatformState.data.chatStoreData.activeChat.id,
                    message: {
                        date: new Date().toLocaleDateString(),
                        model: 'llava:7b-v1.6',
                        sender: "user",
                        session_id: data.data.crossPlatformState.data.chatStoreData.activeChat.session_id,
                        time: new Date().toLocaleTimeString(),
                        ...data.data.cameraStoreData,
                        text: data.data.cameraStoreData.message
                    },
                };
                const response = await sensativeClient.post('/api/aichat/postChat', payload);
                console.log("response: ", response)
            };

            const result = await db
                .insert(schema.cross_platform_apps)
                .values(data)
                .returning();

            return c.json(result)

        } catch (error: any) {
            
            return c.json(error);
        }
    })

    .delete('/', async (c: Context) => {
        const { db } = c.var;
        const id = c.req.query('id')

        try {
            const result = await db
                .query
                .cross_platform_apps
                .delete()
                .where({ id })
                .returning();

            return c.json(result);

        } catch (error: any) {

            return c.json(error);
        }
    });


export { crossPlatformRoutes };