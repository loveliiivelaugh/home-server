import { schema } from "../../db";

export const scripts = {
    updateStoredModelsList: async (props: any) => {
        const { sensativeClient, storedModels, db } = props;

        let path = "api/v1/ollama/available-models";
        const ollamaModels = (await sensativeClient.get(path)).data;

        const modelNamesInDb = storedModels.map(({ value }: { value: any }) => value);

        const modelsNotAddedYet = ollamaModels.models
            .map((ollamaModel: any) => {
                if (!modelNamesInDb.includes(ollamaModel.name)) 
                    return ({
                        // id: uuidv4(),
                        name: ollamaModel.name,
                        value: ollamaModel.name
                    });
            }).filter((value: null | undefined) => value); // Remove null or undefined values

        if (modelsNotAddedYet.length) {
            const result = await db
                .insert(schema.models)
                .values(modelsNotAddedYet)
                .returning();

            return [ ...storedModels, ...result ];
        }
        else return storedModels;
    }
};