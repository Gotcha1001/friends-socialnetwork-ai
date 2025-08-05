// app/api/profile/route.js
import { db } from "@/configs/db";
import { profiles, users } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { uploadImage } from "../../lib/cloudinary";

export async function POST(request) {
  try {
    // Get current user for authentication
    const clerkUser = await currentUser();
    console.log("API: /api/profile currentUser data", {
      clerkUserId: clerkUser?.id,
      clerkUsername: clerkUser?.username,
      clerkEmail: clerkUser?.primaryEmailAddress?.emailAddress,
    });

    const userId = clerkUser?.id;
    if (!userId) {
      console.log("API: No userId found, returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Query the database for the user
    const user = await db
      .select({ id: users.id, clerkId: users.clerkId })
      .from(users)
      .where(eq(users.clerkId, userId))
      .execute();
    console.log("API: User query result", user);

    if (!user.length) {
      console.log("API: User not found in database, returning 404");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userIdInDb = user[0].id;
    const formData = await request.formData();
    const bio = formData.get("bio") || "";
    const location = formData.get("location") || "";
    const interests = JSON.parse(formData.get("interests") || "[]");
    const file = formData.get("profileImage");

    console.log("API: Form data received", {
      bio,
      location,
      interests,
      hasFile: !!file,
    });

    let profileImage = null;
    if (file) {
      console.log("API: Uploading image to Cloudinary");
      profileImage = await uploadImage(file);
      console.log("API: Image uploaded", profileImage);
    }

    const existingProfile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userIdInDb))
      .execute();
    console.log("API: Existing profile check", existingProfile);

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
      console.log("API: Profile updated", updatedProfile[0]);

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
    console.log("API: Profile created", newProfile[0]);

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
