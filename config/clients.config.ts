import axios from 'axios';
import { createMiddleware } from 'hono/factory';


// Single source of truth for all paths
const paths = { 
    github: '/api/github', 
    openfitness: '/api/openfitness',
    privategpt: '/api/privategpt',
    secrets: '/api/secrets',
    cross_platform: '/api/cross-platform',
    theme: '/api/theme/themeConfig',
    cms: '/api/cms/content',
    database: '/database',
    users: '/users'
};

const secrets = {
    nutritionix_app_id: Bun.env.NUTRITIONIX_APP_ID,
    nutritionix_key: Bun.env.NUTRITIONIX_KEY,
    api_ninjas_key: Bun.env.API_NINJAS_KEY,
    privateGPT: 'http://127.0.0.1:8001/v1'
}

// Initialize external API clients with secrets
const initApiClients = () => createMiddleware(async (c, next) => {


    const nutritionixClient = axios.create({
        baseURL: `https://trackapi.nutritionix.com/v2`,
        headers: {
            'Content-Type': 'application/json',
            'x-app-id': secrets.nutritionix_app_id,
            'x-app-key': secrets.nutritionix_key
        }
    });

    const exerciseClient = axios.create({
        baseURL: `https://api.api-ninjas.com/v1`,
        headers: {
            'x-api-key': secrets.api_ninjas_key
        }
    });

    const privategGptClient = axios.create({
        baseURL: (secrets.privateGPT || `http://127.0.0.1:8001/v1`)
    });

    const clients = {
        nutritionixClient,
        exerciseClient,
        privategGptClient
    };

    c.set('clients', clients);

    await next();
});

export { initApiClients, paths };