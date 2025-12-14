import type { Route } from "./+types/home";
import { Link } from "react-router";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Task Manager - Project Info" },
    { name: "description", content: "Project information and public access." },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return {
    envMessage: context.cloudflare.env.VALUE_FROM_CLOUDFLARE
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 font-sans text-gray-900">
      <main className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-blue-600">
          Cloudflare Task Manager
        </h1>
        <p className="text-xl text-gray-600">
          A robust task management solution built on the edge with Cloudflare Workers, D1, and Remix (React Router v7).
        </p>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-left space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Project Details</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Architecture:</strong> Serverless Edge Computing</li>
            <li><strong>Database:</strong> Distributed SQLite (D1)</li>
            <li><strong>Security:</strong> Cloudflare Access (Zero Trust)</li>
            <li><strong>Frontend:</strong> React Router v7 + TailwindCSS</li>
          </ul>
        </div>

        <div className="pt-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Access Private Dashboard &rarr;
          </Link>
        </div>

        <p className="text-sm text-gray-400 pt-10">
          System Message: {loaderData.envMessage}
        </p>
      </main>
    </div>
  );
}
