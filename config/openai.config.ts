
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: Bun.env.OPENAI_KEY
});


export { openai };