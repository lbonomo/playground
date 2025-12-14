import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("login", "routes/login.tsx"),
    route("logout", "routes/logout.ts"),
    route("dashboard", "routes/dashboard.tsx", [
        index("routes/dashboard._index.tsx"),
    ]),
] satisfies RouteConfig;
