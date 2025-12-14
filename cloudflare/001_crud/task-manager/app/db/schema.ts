import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const tasks = sqliteTable("tasks", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    description: text("description"),
    status: text("status", { enum: ["pending", "in-progress", "done"] }).default("pending"),
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
