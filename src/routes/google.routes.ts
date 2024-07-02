import { Hono } from "hono";
import { Context } from "hono";
import { youtubeClient } from "../../config/google.config";
import { handleAdminOnly } from "../../middleware";

const googleRoutes = new Hono();

googleRoutes.get('/', handleAdminOnly, async (c: Context) => {
    // const { youtubeClient } = c.var.clients;
    console.log({ youtubeClient })

    try {
        const activitiesData = await youtubeClient.activities.list();
        const videosData = await youtubeClient.videos.list();

        return c.json({ "status": "success", activitiesData, videosData })
    
    } catch (error: any) {
        
        return c.json({error});
    }
})

export { googleRoutes };