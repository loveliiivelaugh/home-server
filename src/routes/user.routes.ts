import { Hono } from "hono";
import { Context, Next } from "hono";

import { sign, verify } from 'hono/jwt';
import {
    getSignedCookie,
    setSignedCookie,
    deleteCookie,
} from 'hono/cookie'

const userRoutes = new Hono();

const { JWT_SECRET, COOKIE_SIGNING_KEY: anotherSecret } = Bun.env;

userRoutes
    .get('/user', async (c: Context) => {
        const decodedJwt = c.get('jwtPayload');
        try {
            if (!decodedJwt) return c.json("No user found", 404);
    
            return c.json(decodedJwt, 200);
    
        } catch (error: any) {
            console.error(error, "Error getting user");
            return c.json(error, 500);
        }
    })

    .post('/login', async (c: Context) => {
        const user = await c.req.json();
        // // Simulate user authentication and JWT creation
        // const user = { id: 1, name: 'John Doe' }; // Example user object
        const jwt = await sign(user, JWT_SECRET as string); // Create a JWT

        // Set the JWT in an HttpOnly, Secure cookie
        await setSignedCookie(c, 'token', jwt, anotherSecret as string, {
            httpOnly: true,
            secure: true, // Ensure this is true in a production environment with HTTPS
            sameSite: 'strict', // Optional, to prevent CSRF
            maxAge: 3600 // Set cookie expiration time (in seconds)
        })
        
        return c.json({ status: 'success' });
    })

    // .get('/protected', async (c: Context) => {
    //     // Retrieve the JWT from the cookie
    //     const token = await getSignedCookie(
    //         c,
    //         anotherSecret as string,
    //         'token'
    //     );
        
    //     if (!token) {
    //         return c.json({ status: 'error', message: 'No token provided' }, 401);
    //     }

    //     try {
    //         const decoded = verify(token, JWT_SECRET as string); // Verify the JWT
            
    //         return c.json({ status: 'success', user: decoded });

    //     } catch (err) {
    //         return c.json({ status: 'error', message: 'Invalid token' }, 401);
    //     }
    // })

    .get('/logout', async (c: Context) => {
        await deleteCookie(c, 'token');
        return c.json({ status: 'success' });
    });

export { userRoutes }