import axios from 'axios';
import { createMiddleware } from 'hono/factory';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: Bun.env.NOTION_API_KEY });


interface BasicAuthConfig {
    username: string;
    password: string;
}

const basicAuthConfig = <BasicAuthConfig>{
    username: Bun.env.BASIC_AUTH_USERNAME,
    password: Bun.env.BASIC_AUTH_PASSWORD,
};

const trustedSources: string[] = [
    Bun.env.FAMILYAPPS_HOSTNAME as string,
    Bun.env.OPENFITNESS_HOSTNAME as string,
    Bun.env.SMARTCAMERA_HOSTNAME as string,
    Bun.env.AICHAT_HOSTNAME as string,
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003'
];

const allowedHeaders: string[] = [
    'authorization', 
    'auth-token',
    'Content-Type'
];

const corsConfig = {
    origin: trustedSources, 
    allowHeaders: allowedHeaders,
    allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true
};

// Single source of truth for all paths
const paths = {
    github: '/api/github',
    openfitness: '/api/openfitness',
    aichat: '/api/aichat',
    camera: '/api/camera',
    privategpt: '/api/privategpt',
    secrets: '/api/secrets',

    appConfig: '/api/appConfig', // appConfig route includes cross_platform, theme, and cms routes data
    cross_platform: '/api/cross-platform',
    theme: '/api/theme/themeConfig',
    cms: '/api/cms/content',

    sensative: '/api/sensative',
    database: '/database',
    users: '/auth/v1'
};

// Export to CMS to import into Microservices routers
const pathsArray = [
    {
        name: "home",
        path: "",
        methods: ["get", "post", "put", "delete"],
        roles: []
    },
    {
        name: "users",
        path: "/auth/v1/users",
        methods: ["get", "post", "put", "delete"], // Methods supported for path
        role: []
    },
];

// ?? This function is to be used in the Microservices Request Clients
// const queries = pathsArray.map((route) => ({
//     ...route.methods.map((method: string) => {
//         [`${method}${route.name}Query`] = {
//             queryKey: [`${method}${route.name}`],
//             queryFn: async (payload: any | undefined) => await (client as any)[method](route.path, payload),
//         }
//     }).flat()
// })).flat();


const secrets = {
    nutritionix_app_id: Bun.env.NUTRITIONIX_APP_ID,
    nutritionix_key: Bun.env.NUTRITIONIX_KEY,
    api_ninjas_key: Bun.env.API_NINJAS_KEY
};

// Initialize external API clients with secrets
const initApiClients = () => createMiddleware(async (c, next) => {
    // upgradeWebSocket experimental to handle websocket traffic

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
        sensativeClient,
        notionClient: notion
    };

    c.set('clients', clients);

    await next();
});

export { 
    initApiClients, 
    paths,
    basicAuthConfig,
    corsConfig,
    trustedSources
};