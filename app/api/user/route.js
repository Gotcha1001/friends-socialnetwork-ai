// import { db } from "@/configs/db";
// import { users } from "@/configs/schema";
// import { currentUser } from "@clerk/nextjs/server";
// import { eq } from "drizzle-orm";
// import { NextResponse } from "next/server";

// export async function POST(request) {
//   try {
//     const user = await currentUser();
//     if (!user) {
//       console.log("No user found in currentUser");
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const {
//       id: clerkUserId,
//       primaryEmailAddress,
//       firstName,
//       lastName,
//       publicMetadata,
//     } = user;

//     const email = primaryEmailAddress?.emailAddress || "";
//     const name = `${firstName || ""} ${lastName || ""}`.trim() || "Unknown";
//     const isAdmin = !!publicMetadata?.admin;

//     console.log("User data to save:", { clerkUserId, email, name, isAdmin });

//     const existingUser = await db
//       .select()
//       .from(users)
//       .where(eq(users.clerkUserId, clerkUserId))
//       .execute();

//     if (existingUser.length > 0) {
//       const updatedUser = await db
//         .update(users)
//         .set({
//           email,
//           name,
//           isAdmin,
//           updatedAt: new Date(),
//         })
//         .where(eq(users.clerkUserId, clerkUserId))
//         .returning();
//       console.log("User updated:", updatedUser[0]);
//       return NextResponse.json({
//         message: "User updated successfully",
//         user: updatedUser[0],
//       });
//     }

//     const newUser = await db
//       .insert(users)
//       .values({
//         clerkUserId,
//         email,
//         name,
//         isAdmin,
//         // profileType is not set, defaults to null
//       })
//       .returning();
//     console.log("User created:", newUser[0]);
//     return NextResponse.json({
//       message: "User created successfully",
//       user: newUser[0],
//     });
//   } catch (error) {
//     console.error("Error processing user:", error.message);
//     return NextResponse.json(
//       { error: "Internal server error", details: error.message },
//       { status: 500 }
//     );
//   }
// }

// app/api/user/route.js
import { db } from "@/configs/db";
import { users } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

async function generateUniqueUsername(email) {
  const emailPrefix = email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
  let username = `${emailPrefix}_${Math.random().toString(36).substring(2, 8)}`;
  let existing = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .execute();
  let attempts = 0;
  while (existing.length > 0 && attempts < 5) {
    username = `${emailPrefix}_${Math.random().toString(36).substring(2, 8)}`;
    existing = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .execute();
    attempts++;
  }
  if (existing.length > 0) {
    throw new Error("Unable to generate unique username");
  }
  return username;
}

export async function POST(request) {
  try {
    console.log(
      "API: /api/users POST request received at",
      new Date().toISOString()
    );

    const user = await currentUser();
    if (!user) {
      console.log(
        "API: No user found in currentUser, authentication may be missing"
      );
      return NextResponse.json(
        { error: "Unauthorized: No Clerk user found" },
        { status: 401 }
      );
    }

    const {
      id: clerkUserId,
      primaryEmailAddress,
      firstName,
      lastName,
      publicMetadata,
    } = user;

    const email = primaryEmailAddress?.emailAddress || "";
    const name = `${firstName || ""} ${lastName || ""}`.trim() || "Unknown";
    const isAdmin = !!publicMetadata?.admin;
    const username = await generateUniqueUsername(email);

    console.log("API: User data extracted:", {
      clerkUserId,
      email,
      name,
      username,
      isAdmin,
    });

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkUserId))
      .execute();

    console.log("API: Existing user check result:", {
      existingUserCount: existingUser.length,
    });

    if (existingUser.length > 0) {
      const updatedUser = await db
        .update(users)
        .set({
          email,
          name,
          username: existingUser[0].username, // Preserve existing username
          isAdmin,
          updatedAt: new Date(),
        })
        .where(eq(users.clerkId, clerkUserId))
        .returning();

      console.log("API: User updated:", updatedUser[0]);
      return NextResponse.json({
        message: "User updated successfully",
        user: updatedUser[0],
      });
    }

    const newUser = await db
      .insert(users)
      .values({
        clerkId: clerkUserId,
        email,
        username,
        name,
        isAdmin,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    console.log("API: User created:", newUser[0]);
    return NextResponse.json({
      message: "User created successfully",
      user: newUser[0],
    });
  } catch (error) {
    console.error("API: Error processing user:", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
