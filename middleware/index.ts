import { Context, Next } from "hono";

import { createMiddleware } from 'hono/factory';
import { verify } from 'hono/jwt';
import { eq } from "drizzle-orm";

import { supabase } from '../config/supabase.config';
import { trustedSources } from "../config/clients.config";
import { schema } from "../db";


const authMiddleware = createMiddleware(async (c: Context, next: Next) => {
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return c.json({ status: 'error', message: 'Invalid Authorization header' }, 400);
    };

    // Decode Bearer token
    const jwt = authHeader.substring(7, authHeader.length);

    const decodedPayload = jwt 
        ? await verify(jwt, Bun.env.JWT_SECRET as string) 
        : null;

    console.log("decodedPayload: ", decodedPayload)
    c.set("jwtPayload", decodedPayload);

    // Check isAuthorized
    const isAuthorized: boolean = decodedPayload?.app_id
        ? trustedSources.includes(decodedPayload.app_id as string)
        : false;
    
    try {

        const { user } = (await supabase.auth.getUser(decodedPayload?.sub as string)).data;

        const isAuthenticated = ((user as { aud: string })?.aud === "authenticated");

        if (!isAuthenticated || !isAuthorized) {

            return c.text(`${JSON.stringify({ isAuthenticated, isAuthorized })}`, 401);
        }
        else await next();

    } catch (error) {
        console.error(error, "authMiddleware: ERROR: ")
        return c.text(`${JSON.stringify({ isAuthenticated: false, isAuthorized })}`, 401);
    }
});

const handleAdminOnly = async (c: Context, next: Next) => {
    const decodedJwt = c.get('jwtPayload');
    const { db } = c.var;

    if (!decodedJwt) return c.json("No user found", 404);

    try {
        const rolesData = (await db
            .select()
            .from(schema.user_roles)
            .where(eq(schema.user_roles.user_id, decodedJwt.user_id))
        );
        
        type RoleRowType = { id: number, user_id: string, role: string };
        
        const isAdmin = rolesData
            .some((role: RoleRowType) => JSON.parse(role.role).includes('admin'));
        
        if (!isAdmin) return c.json("Unauthorized", 401);
        else return next();

    } catch (error: any) {
        
        return c.json(error, 500);
    }
};


export { authMiddleware, handleAdminOnly };