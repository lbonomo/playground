import { Form, useNavigation } from "react-router";
import type { Route } from "./+types/dashboard._index";
import { getDb } from "../db/client.server";
import { tasks } from "../db/schema";
import { desc, eq } from "drizzle-orm";

export async function loader({ context }: Route.LoaderArgs) {
    const db = getDb(context.cloudflare.env.DB);
    const taskList = await db.select().from(tasks).orderBy(desc(tasks.createdAt));
    return { tasks: taskList };
}

export async function action({ request, context }: Route.ActionArgs) {
    const db = getDb(context.cloudflare.env.DB);
    const formData = await request.formData();
    const intent = formData.get("intent");

    if (intent === "create") {
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        if (!title) return { error: "Title is required" };
        await db.insert(tasks).values({ title, description });
    } else if (intent === "delete") {
        const id = Number(formData.get("id"));
        await db.delete(tasks).where(eq(tasks.id, id));
    } else if (intent === "toggle") {
        const id = Number(formData.get("id"));
        const currentStatus = formData.get("status") as string;
        const newStatus = currentStatus === "done" ? "pending" : "done";
        await db.update(tasks).set({ status: newStatus }).where(eq(tasks.id, id));
    }
    return null;
}

export default function DashboardIndex({ loaderData, actionData }: Route.ComponentProps) {
    const navigation = useNavigation();
    const isCreating = navigation.formData?.get("intent") === "create";

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
                <p className="text-gray-500">Manage your project tasks.</p>
            </div>

            {/* Create Task Form */}
            <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-4">New Task</h2>
                <Form method="post" className="space-y-4">
                    <input type="hidden" name="intent" value="create" />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" name="title" id="title" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" placeholder="Fix login bug" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <input type="text" name="description" id="description" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" placeholder="Optional details..." />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isCreating}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            {isCreating ? "Adding..." : "Add Task"}
                        </button>
                    </div>
                </Form>
            </div>

            {/* Task List */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {loaderData.tasks.length === 0 ? (
                        <li className="p-6 text-center text-gray-500">No tasks yet. Create one above!</li>
                    ) : (
                        loaderData.tasks.map((task) => (
                            <li key={task.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-start space-x-3">
                                    <Form method="post">
                                        <input type="hidden" name="intent" value="toggle" />
                                        <input type="hidden" name="id" value={task.id} />
                                        <input type="hidden" name="status" value={task.status || "pending"} />
                                        <button type="submit" className={`mt-1 h-5 w-5 rounded border flex items-center justify-center ${task.status === 'done' ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 text-transparent'}`}>
                                            {task.status === 'done' && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                                        </button>
                                    </Form>
                                    <div>
                                        <p className={`text-sm font-medium ${task.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{task.title}</p>
                                        {task.description && <p className="text-sm text-gray-500">{task.description}</p>}
                                    </div>
                                </div>
                                <Form method="post" onSubmit={(e) => !confirm("Delete this task?") && e.preventDefault()}>
                                    <input type="hidden" name="intent" value="delete" />
                                    <input type="hidden" name="id" value={task.id} />
                                    <button type="submit" className="text-red-600 hover:text-red-900 text-sm font-medium px-2 py-1 rounded hover:bg-red-50">Delete</button>
                                </Form>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}
