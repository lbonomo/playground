import { Form, redirect, useNavigation, useActionData } from "react-router";
import type { Route } from "./+types/login";
import { getSessionStorage } from "../sessions";

export function meta({ }: Route.MetaArgs) {
    return [{ title: "Login - Task Manager" }];
}

export async function loader({ context, request }: Route.LoaderArgs) {
    const sessionStorage = getSessionStorage(context.cloudflare.env.SESSION_SECRET);
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    if (session.has("userId")) {
        return redirect("/dashboard");
    }
    return null;
}

export async function action({ context, request }: Route.ActionArgs) {
    const formData = await request.formData();
    const username = formData.get("username");
    const password = formData.get("password");

    const validUsername = context.cloudflare.env.ADMIN_USERNAME;
    const validPassword = context.cloudflare.env.ADMIN_PASSWORD;

    if (username === validUsername && password === validPassword) {
        const sessionStorage = getSessionStorage(context.cloudflare.env.SESSION_SECRET);
        const session = await sessionStorage.getSession();
        session.set("userId", username as string);
        return redirect("/dashboard", {
            headers: {
                "Set-Cookie": await sessionStorage.commitSession(session),
            },
        });
    }

    return { error: "Invalid username or password" };
}

export default function Login({ actionData }: Route.ComponentProps) {
    const navigation = useNavigation();
    const isLoggingIn = navigation.state === "submitting";

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign in to your dashboard
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <Form method="post" className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <div className="mt-1">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        {actionData?.error && (
                            <div className="text-red-600 text-sm">{actionData.error}</div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoggingIn}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                {isLoggingIn ? "Signing in..." : "Sign in"}
                            </button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}
