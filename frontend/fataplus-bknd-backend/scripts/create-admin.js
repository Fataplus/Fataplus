#!/usr/bin/env node

/**
 * Script pour créer un utilisateur admin dans la base de données D1
 */

import bcrypt from 'bcryptjs';

async function createAdminUser() {
  const email = 'fenohery.fanomezanirina@gmail.com';
  const password = 'admin123'; // Vous devriez changer ce mot de passe
  const role = 'admin';

  // Hash du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log('Configuration utilisateur admin:');
  console.log('Email:', email);
  console.log('Mot de passe (temporaire):', password);
  console.log('Rôle:', role);
  console.log('Hash du mot de passe:', hashedPassword);
  console.log('');
  console.log('Instructions:');
  console.log('1. Connectez-vous à votre base de données D1 via: npx wrangler d1 execute fataplus-website-db --command="..."');
  console.log('2. Exécutez la requête SQL suivante:');
  console.log(`
INSERT INTO users (id, email, password, role, created_at, updated_at)
VALUES (
  '${crypto.randomUUID()}',
  '${email}',
  '${hashedPassword}',
  '${role}',
  datetime('now'),
  datetime('now')
);`);
  console.log('');
  console.log('IMPORTANT: Changez le mot de passe après la première connexion!');
}

createAdminUser().catch(console.error);