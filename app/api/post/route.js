const { db } = require("@/configs/db");
const { posts, users } = require("@/configs/schema");
const { eq } = require("drizzle-orm");
const { NextResponse } = require("next/server");
const { auth } = require("@clerk/nextjs/server");

async function POST(request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.clerkId, userId))
      .execute();

    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { content } = await request.json();
    if (
      !content ||
      typeof content !== "string" ||
      content.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const newPost = await db
      .insert(posts)
      .values({
        userId: user[0].id,
        content: content.trim(),
        createdAt: new Date(),
      })
      .returning();

    return NextResponse.json({
      message: "Post created successfully",
      post: newPost[0],
    });
  } catch (error) {
    console.error("API: Error creating post:", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

module.exports = { POST };
