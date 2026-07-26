import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const nouvelAdminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const utilisateurs = await prisma.user.findMany({
    select: { id: true, email: true, name: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(utilisateurs);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const parsed = nouvelAdminSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existant = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existant) {
    return NextResponse.json({ error: "Un compte avec cet email existe déjà." }, { status: 409 });
  }

  const hashed = await bcrypt.hash(parsed.data.password, 10);
  const utilisateur = await prisma.user.create({
    data: { email: parsed.data.email, password: hashed, name: parsed.data.name },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  return NextResponse.json(utilisateur, { status: 201 });
}
