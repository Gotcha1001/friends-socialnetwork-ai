const {
  pgTable,
  serial,
  text,
  timestamp,
  jsonb,
  boolean,
} = require("drizzle-orm/pg-core");
const { relations } = require("drizzle-orm");

// Users table (linked to Clerk for authentication)
const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull(),
  username: text("username").notNull().unique(),
  name: text("name"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Profiles table (user's personal information)
const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: serial("user_id")
    .references(() => users.id)
    .notNull(),
  bio: text("bio"),
  interests: jsonb("interests").default([]),
  location: text("location"),
  profileImage: text("profile_image"), // Added for Cloudinary URL
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Posts table (user-generated content)
const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  userId: serial("user_id")
    .references(() => users.id)
    .notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Friend requests table
const friendRequests = pgTable("friend_requests", {
  id: serial("id").primaryKey(),
  senderId: serial("sender_id")
    .references(() => users.id)
    .notNull(),
  receiverId: serial("receiver_id")
    .references(() => users.id)
    .notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations for easier querying
const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  posts: many(posts),
  sentFriendRequests: many(friendRequests, { relationName: "sender" }),
  receivedFriendRequests: many(friendRequests, { relationName: "receiver" }),
}));

const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
}));

const friendRequestsRelations = relations(friendRequests, ({ one }) => ({
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

module.exports = {
  users,
  profiles,
  posts,
  friendRequests,
  usersRelations,
  profilesRelations,
  postsRelations,
  friendRequestsRelations,
};
