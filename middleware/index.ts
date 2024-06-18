import { Context, Next } from "hono";
import { createMiddleware } from 'hono/factory';
import { supabase } from '../config/supabase.config';

const authMiddleware = createMiddleware(async (c: Context, next: Next) => {
    const authString = c.req.header()["auth-token"];
    const [authTokenString, appIdString] = authString.split("&");
    const [authTokenKey, id] = authTokenString.split("=");
    const [appIdKey, appId] = appIdString.split("=");
    const [appNameString, clientIdString] = appId.split("|");
    const [appNameKey, appName] = appNameString.split("?");
    const [clientIdKey, clientId] = clientIdString.split("?");
    const authorizedApps = JSON.parse(Bun.env.CLIENTS || "{}");
    const isAuthorized = ((authorizedApps as any)[appName] === clientId);

    try {

        const { user } = (await supabase.auth.getUser(id)).data;
        const isAuthenticated = ((user as { aud: string })?.aud === "authenticated");

        if (!isAuthenticated || !isAuthorized) {
            c.status(401);
            return c.text("Unauthorized");
        }
        else await next();

    } catch (error) {
        console.error(error, "authMiddleware: ERROR: ")
        c.status(401);
        return c.text("Unauthorized");
    }
});

export { authMiddleware }