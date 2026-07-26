/**
 * Script pour créer le compte admin initial.
 * Usage : npx tsx prisma/seed-admin.ts
 */
import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import readline from "readline";

const prisma = new PrismaClient();

function ask(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(question, (answer) => {
    rl.close();
    resolve(answer);
  }));
}

async function main() {
  const email = await ask("Email de l'admin : ");
  const password = await ask("Mot de passe : ");
  const name = await ask("Nom (optionnel) : ");

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashed, name: name || undefined },
    create: { email, password: hashed, name: name || undefined },
  });

  console.log(`✅ Admin créé/mis à jour : ${user.email}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
