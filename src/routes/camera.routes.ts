import { Hono } from "hono";


const cameraRoutes = new Hono();


cameraRoutes
    .post('/upload', async (c: any) => {

        // Get the request body as a readable stream
        const readable = await c.req.blob();
        const stream: ReadableStream = new ReadableStream(readable);
        const path = "./test-recording.mp4";
        const response = new Response(stream);

        await Bun.write(path, response);
        
        console.log(
            '/api/camera/upload: video stream', 
            stream, 
            response
        );

        // Return a response indicating success
        return c.json({ status: "success" });
    })


export { cameraRoutes };