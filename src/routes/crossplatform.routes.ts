import { Hono } from "hono";
import { Context } from "hono";

import { schema } from "../../db";
import { supabase } from "../../config/supabase.config";
import { eq } from "drizzle-orm";


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
            // When SmartCamera is routing back to AIChat ...
            // ... use the data to add a new message to a chat ...
            // ... when sending an image from camera to aichat
            if (
                (data.appId === "camera") 
                && (data?.data?.crossPlatformState.data?.aichatStore)
            ) {
                // Create a message payload
                const payload = {
                    id: data.data.crossPlatformState.data.aichatStore.activeChat.id,
                    message: {
                        date: new Date().toLocaleDateString(),
                        model: 'llava:7b-v1.6',
                        sender: "user",
                        session_id: data.data.crossPlatformState.data.aichatStore.activeChat.session_id,
                        time: new Date().toLocaleTimeString(),
                        ...data.data.cameraStoreData,
                        text: data.data.cameraStoreData.message
                    }
                };
                
                const response = await sensativeClient.post('/api/aichat/postChat', payload);
                console.log("response: ", response)
            };

            const result = await db
                .insert(schema.cross_platform_apps)
                .values(data)
                .returning();

            const redirect = data.destination_url + `/cross_platform?id=${result[0].id}`;
            
            return c.json({...result, redirect}, 200);

        } catch (error: any) {
            
            return c.json(error, 500);
        }
    })

    .delete('/', async (c: Context) => {
        const { db } = c.var;
        const id = c.req.query('id')

        if (id) try {
            const result = await db
                .delete(schema.cross_platform_apps)
                .where(eq(schema.cross_platform_apps.id, parseInt(id)))
                .returning();

            return c.json(result, 201);

        } catch (error: any) {

            return c.json(error, 500);
        }
        else return c.json('Missing CPX row ID', 500);
    });


export { crossPlatformRoutes };