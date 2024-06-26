import axios from 'axios';
import { createMiddleware } from 'hono/factory';


interface BasicAuthConfig {
    username: string;
    password: string;
}

const basicAuthConfig = <BasicAuthConfig>{
    username: Bun.env.BASIC_AUTH_USERNAME,
    password: Bun.env.BASIC_AUTH_PASSWORD,
};

const trustedSources = [
    Bun.env.FAMILYAPPS_HOSTNAME,
    Bun.env.OPENFITNESS_HOSTNAME,
    Bun.env.SMARTCAMERA_HOSTNAME,
    Bun.env.AICHAT_HOSTNAME,
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
];

// Single source of truth for all paths
const paths = {
    github: '/api/github',
    openfitness: '/api/openfitness',
    aichat: '/api/aichat',
    privategpt: '/api/privategpt',
    secrets: '/api/secrets',

    appConfig: '/api/appConfig', // appConfig route includes cross_platform, theme, and cms routes data
    cross_platform: '/api/cross-platform',
    theme: '/api/theme/themeConfig',
    cms: '/api/cms/content',

    sensative: '/api/sensative',
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

    const sensativeClient = axios.create({
        baseURL: Bun.env.PRIVATE_HOSTNAME,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'auth-token': Bun.env.PRIVATE_SECRET
        },
        auth: {
            username: (Bun.env.BASIC_AUTH_USERNAME || ""),
            password: (Bun.env.BASIC_AUTH_PASSWORD || "")
        }
    });

    const clients = {
        nutritionixClient,
        exerciseClient,
        sensativeClient
    };

    c.set('clients', clients);

    await next();
});

export { 
    initApiClients, 
    paths,
    basicAuthConfig,
    trustedSources 
};