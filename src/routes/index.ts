import { Hono } from 'hono';
import { Context } from 'hono';

// import { githubRoutes } from "./github.routes";
// import { openfitnessRoutes } from "./openfitness.routes";
// import { databaseRoutes } from "./database.routes";
// import { privateGptRoutes } from './privategpt.routes';

// import { Component, stream } from '../components/ServerComponent';
import { themeConfig as microservicesThemeConfig } from '../../config/theme.config';

// import { schema } from '../../db';


const paths = { 
    github: '/api/github', 
    openfitness: '/api/openfitness',
    privategpt: '/api/privategpt',
    secrets: '/api/secrets',
    cross_platform: '/api/cross-platform',
    theme: '/api/theme/themeConfig',
    database: '/database',
    users: '/users'
};

const routes = new Hono();

// Theme for microservices
routes.get(
    paths.theme, 
    async (c: Context) => c.json(microservicesThemeConfig)
);


routes.get('/', (c: Context) => c.text('Welcome to the FamilyAppsSuite server!'));

export { routes };