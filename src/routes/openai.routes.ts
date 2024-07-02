import { Hono } from "hono";
import { Context } from "hono";
import * as fs from "fs";
import { openai } from "../../config/openai.config";


const openaiRoutes = new Hono();

openaiRoutes.get('/', async (c: Context) => {
    const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream("/path/to/file/audio.mp3"),
        model: "whisper-1",
    });

    console.log(transcription.text);

    return c.text("open ai routes!")
});

export { openaiRoutes };