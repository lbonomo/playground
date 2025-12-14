import { createCookieSessionStorage } from "react-router";

type SessionData = {
    userId: string;
};

type SessionFlashData = {
    error: string;
};

export function getSessionStorage(secret: string) {
    return createCookieSessionStorage<SessionData, SessionFlashData>({
        cookie: {
            name: "__session",
            httpOnly: true,
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
            sameSite: "lax",
            secrets: [secret],
            secure: true, // Requires HTTPS (or localhost)
        },
    });
}
