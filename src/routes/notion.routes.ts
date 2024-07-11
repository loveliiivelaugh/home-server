import { Hono } from "hono";
import { Context } from "hono";


const buildMarkdown = async ({ notionPageContent }: any) => {
    const { results } = notionPageContent;

    const date = new Date(results[0]?.last_edited_time).toLocaleDateString();
    const time = new Date(results[0]?.last_edited_time).toLocaleTimeString();

    type BlockType = { text: { content: string } };
    type ContentType = { paragraph: { rich_text: BlockType[] } };

    return [
        `Last updated: ${date} @ ${time}`,
        ...results
            .map((content: ContentType) => {
                const text = content?.paragraph?.rich_text
                    .map((block: BlockType) => block?.text?.content)
                    .join('');
                return text
            })
            .filter(Boolean)
    ].join('\n\n');
};

async function extractImages({ notionPageContent }: any) {
    const { results } = notionPageContent;

    type BlockType = { image: { file: { url: string } } };
    
    return results
        .map((content: BlockType) => content?.image?.file?.url)
        .filter(Boolean);
};


const notionRoutes = new Hono();


notionRoutes.get('/', async (c: Context) => {
    const { notionClient } = c.var.clients;
    // FamilyApps Docs Notion Page ID
    const pageId = '356fc8dd-2460-47a2-bd0f-860713427d30';
    
    try {
        const notionPageContent = await notionClient.blocks.children.list({
            block_id: pageId,
            page_size: 50,
        });
        
        const markdown = await buildMarkdown({ notionPageContent });
        const images = await extractImages({ notionPageContent });

        return c.json({ markdown, images });

    } catch (error: any) {
        console.error(error?.message);

        return c.json(error?.message, 500)
    }
});

export { notionRoutes }