import { redirect } from "react-router";
import type { Route } from "./+types/logout";
import { getSessionStorage } from "../sessions";

export async function action({ context, request }: Route.ActionArgs) {
    const sessionStorage = getSessionStorage(context.cloudflare.env.SESSION_SECRET);
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    return redirect("/login", {
        headers: {
            "Set-Cookie": await sessionStorage.destroySession(session),
        },
    });
}
