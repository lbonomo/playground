import { Outlet, Link, useLoaderData, Form } from "react-router";
import type { Route } from "./+types/dashboard";
import { getSessionStorage } from "../sessions";
import { redirect } from "react-router";

export function meta({ }: Route.MetaArgs) {
    return [{ title: "Dashboard - Task Manager" }];
}

export async function loader({ request, context }: Route.LoaderArgs) {
    const sessionStorage = getSessionStorage(context.cloudflare.env.SESSION_SECRET);
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));

    const userId = session.get("userId");

    if (!userId) {
        throw redirect("/login");
    }

    return { userEmail: userId };
}

export default function DashboardLayout({ loaderData }: Route.ComponentProps) {
    const { userEmail } = loaderData;

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:block flex-shrink-0">
                <div className="p-6 border-b border-gray-100">
                    <Link to="/" className="text-xl font-bold text-blue-600 block">Task Manager</Link>
                    <span className="text-xs text-gray-400">Internal Dashboard</span>
                </div>
                <nav className="p-4 space-y-1">
                    <Link to="/dashboard" className="flex items-center px-4 py-2 text-sm font-medium rounded-md bg-blue-50 text-blue-700">
                        Tasks
                    </Link>
                    {/* Future nav items */}
                </nav>
                <div className="absolute bottom-0 w-64 p-4 border-t border-gray-100 bg-gray-50">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">
                            {userEmail[0].toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-gray-700 truncate">{userEmail}</p>
                            <p className="text-xs text-gray-500">Administrator</p>
                        </div>
                    </div>
                    <Form action="/logout" method="post">
                        <button type="submit" className="w-full text-left text-sm text-red-600 hover:text-red-800">
                            Sign out
                        </button>
                    </Form>
                </div>
            </aside>
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="bg-white border-b border-gray-200 p-4 md:hidden flex justify-between items-center">
                    <Link to="/" className="text-lg font-bold text-blue-600">TM</Link>
                    <span className="text-sm font-bold text-gray-700">Dashboard</span>
                    <Form action="/logout" method="post">
                        <button type="submit" className="text-sm text-red-600 font-medium">Log out</button>
                    </Form>
                </header>
                <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
