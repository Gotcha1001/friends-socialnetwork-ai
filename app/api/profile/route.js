const { db } = require("@/configs/db");
const { profiles, users } = require("@/configs/schema");
const { eq } = require("drizzle-orm");
const { NextResponse } = require("next/server");
const { auth } = require("@clerk/nextjs/server");
const { uploadImage } = require("@/lib/cloudinary");

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

    const userIdInDb = user[0].id;
    const formData = await request.formData();
    const bio = formData.get("bio") || "";
    const location = formData.get("location") || "";
    const interests = JSON.parse(formData.get("interests") || "[]");
    const file = formData.get("profileImage");

    let profileImage = null;
    if (file) {
      profileImage = await uploadImage(file);
    }

    const existingProfile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userIdInDb))
      .execute();

    if (existingProfile.length > 0) {
      const updatedProfile = await db
        .update(profiles)
        .set({
          bio,
          location,
          interests,
          profileImage: profileImage || existingProfile[0].profileImage,
          updatedAt: new Date(),
        })
        .where(eq(profiles.userId, userIdInDb))
        .returning();

      return NextResponse.json({
        message: "Profile updated successfully",
        profile: updatedProfile[0],
      });
    }

    const newProfile = await db
      .insert(profiles)
      .values({
        userId: userIdInDb,
        bio,
        location,
        interests,
        profileImage,
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json({
      message: "Profile created successfully",
      profile: newProfile[0],
    });
  } catch (error) {
    console.error("API: Error processing profile:", {
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
