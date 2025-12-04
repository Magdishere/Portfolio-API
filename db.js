import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);
let db;

export async function connectDB() {
  await client.connect();
  db = client.db(process.env.DB_NAME);
  console.log('MongoDB connected');
  return db;
}

export function getDB() {
  if (!db) throw new Error('Database not connected!');
  return db;
}

export function getProjectsCollection() {
  return getDB().collection(process.env.PROJECTS_COLLECTION_NAME);
}

export function getSkillsCollection() {
  return getDB().collection(process.env.SKILLS_COLLECTION_NAME);
}

export function getUsersCollection() {
  return getDB().collection(process.env.USERS_COLLECTION_NAME);
}
