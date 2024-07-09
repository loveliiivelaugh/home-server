import { Hono } from "hono";
import { Context } from "hono";


const buildMarkdown = async ({ notionPage, notionPageContent }: any) => {
    const { results } = notionPageContent;
    const { properties } = notionPage;

    console.log('buildMarkdown: ', { notionPage, notionPageContent })
    const result = [
        `Last updated: ${new Date(results[0]?.last_edited_time).toLocaleDateString()} @ ${new Date(results[0]?.last_edited_time).toLocaleTimeString()}`,
        ...results
            .map((content: any) => {
                const text = content?.paragraph?.rich_text
                    .map((block: any) => block?.text?.content)
                    .join('');
                return text
            })
            .filter(Boolean)
    ].join('\n\n');
    
    return result;
};


const notionRoutes = new Hono();


notionRoutes.get('/', async (c: Context) => {
    const { notionClient } = c.var.clients;
    // FamilyApps Docs Notion Page ID
    const pageId = '356fc8dd-2460-47a2-bd0f-860713427d30';
    
    try {
        const notionPage = await notionClient.pages.retrieve({ page_id: pageId });
        const notionPageContent = await notionClient.blocks.children.list({
            block_id: pageId,
            page_size: 50,
        });
        
        const markdown = await buildMarkdown({ notionPage, notionPageContent });

        return c.json({ markdown });

    } catch (error: any) {
        console.error(error?.message);

        return c.json(error?.message, 500)
    }
});

export { notionRoutes }