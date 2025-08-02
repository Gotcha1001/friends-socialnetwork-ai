import {
  pgTable,
  serial,
  text,
  timestamp,
  jsonb,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table (linked to Clerk for authentication)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: text("clerk_id").notNull().unique(), // Clerk user ID
  email: text("email").notNull(),
  username: text("username").notNull().unique(),
  name: text("name"), // Optional, as it's included in your insert
  isAdmin: boolean("is_admin").default(false), // Add isAdmin to schema
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(), // Add updatedAt
});

// Profiles table (user's personal information)
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: serial("user_id")
    .references(() => users.id)
    .notNull(),
  bio: text("bio"),
  interests: jsonb("interests").default([]), // Store interests as JSON array
  location: text("location"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Posts table (user-generated content)
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: serial("user_id")
    .references(() => users.id)
    .notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Friend requests table
export const friendRequests = pgTable("friend_requests", {
  id: serial("id").primaryKey(),
  senderId: serial("sender_id")
    .references(() => users.id)
    .notNull(),
  receiverId: serial("receiver_id")
    .references(() => users.id)
    .notNull(),
  status: text("status").notNull().default("pending"), // pending, accepted, rejected
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations for easier querying
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  posts: many(posts),
  sentFriendRequests: many(friendRequests, { relationName: "sender" }),
  receivedFriendRequests: many(friendRequests, { relationName: "receiver" }),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
}));

export const friendRequestsRelations = relations(friendRequests, ({ one }) => ({
  sender: one(users, {
    fields: [friendRequests.senderId],
    references: [users.id],
    relationName: "sender",
  }),
  receiver: one(users, {
    fields: [friendRequests.receiverId],
    references: [users.id],
    relationName: "receiver",
  }),
}));
