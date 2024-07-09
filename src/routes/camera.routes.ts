import { Hono } from "hono";
import { Context } from "hono";
// import { scripts } from "../scripts";

// const fs = require('fs');


const cameraRoutes = new Hono();

cameraRoutes
    .post('/upload', async (c: Context) => {
        const body = await c.req.parseBody();
        
        try {

            if (!body.file) {
                console.error('No file uploaded');
                return c.json({ status: 'error', message: 'No file uploaded' }, 400);
            };
    
            const file = body.file as File;

            console.log(`Received file: ${file.name}, size: ${file.size}`, file);
    
            // Define the path to save the file
            const path = `./recordings/${file.name}`;
    
            // Read the file buffer
            const buffer = await file.arrayBuffer();
    
            // Write the buffer to a file using Bun.write
            await Bun.write(path, new Uint8Array(buffer));
    
            console.log('/upload: video stream saved successfully');
    
            // Check if the file exists
            const savedFile = Bun.file(path);
            const fileExists = await savedFile.exists();
            console.log(`File exists: ${fileExists}`);
    
            // Return a response indicating success
            return c.json({ status: 'success' });
            
        } catch (error: any) {
            console.log('/upload: video stream failed to save', error?.message);
            return c.json({ status: "error" });
        }
    })

    // TODO: In progress ...
    .post('/document', async (c: Context) => {
        const { imageSrc } = await c.req.json();
        const { sensativeClient } = c.var.clients;
        
        try {
            const response = await sensativeClient.post('/api/camera/document', { imageSrc });
            
            // Return a response indicating success
            return c.json({ status: 'success', response });
            
        } catch (error: any) {

            return c.json({ status: "error" });
        }
    })


export { cameraRoutes };
