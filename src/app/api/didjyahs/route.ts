// src/app/api/didjyahs/route.ts

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { didjyahs } from "@/server/db/schema";
import { db } from "@/server/db";

export const revalidate = 360; // Revalidate data every 360s (ISR-like caching)
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const records = await db
      .select()
      .from(didjyahs)
      .where(eq(didjyahs.user_id, userId));

    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.error("Error fetching didjyahs:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
