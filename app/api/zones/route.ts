import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const zoneSchema = z.object({
  nom: z.string().min(1),
  frais: z.number().int().min(0),
  ordre: z.number().int().default(0),
});

export async function GET() {
  const zones = await prisma.zoneLivraison.findMany({ orderBy: [{ ordre: "asc" }, { nom: "asc" }] });
  return NextResponse.json(zones);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const parsed = zoneSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const zone = await prisma.zoneLivraison.create({ data: parsed.data });
  return NextResponse.json(zone, { status: 201 });
}
