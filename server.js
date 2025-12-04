import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import { connectDB, getProjectsCollection, getSkillsCollection } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Middleware
app.use(cors({
    origin: 'https://magdishere.github.io', // Allow frontend to connect
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDir));

// Multer setup for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Connect MongoDB
await connectDB();
const projectsCollection = getProjectsCollection();
const skillsCollection = getSkillsCollection();

// ===== Projects Routes =====
app.get('/api/projects', async (req, res) => {
  const projects = await projectsCollection.find({}).toArray();
  res.json(projects);
});

app.post('/api/projects', upload.single('image'), async (req, res) => {
  const { title, description, link } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const result = await projectsCollection.insertOne({ title, description, link, image });
  res.status(201).json(result);
});

app.put('/api/projects/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { title, description, link } = req.body;
  const updateDoc = { $set: { title, description, link } };
  if (req.file) updateDoc.$set.image = `/uploads/${req.file.filename}`;
  const result = await projectsCollection.updateOne({ _id: new ObjectId(id) }, updateDoc);
  res.json(result);
});

app.delete('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  const result = await projectsCollection.deleteOne({ _id: new ObjectId(id) });
  res.json(result);
});

// ===== Skills Routes =====
app.get('/api/skills', async (req, res) => {
  const skills = await skillsCollection.find({}).toArray();
  res.json(skills);
});

app.post('/api/skills', async (req, res) => {
  const { name, level, icon } = req.body;
  if (!name || !level || !icon) return res.status(400).json({ error: 'All fields required' });
  const result = await skillsCollection.insertOne({ name, level: Number(level), icon });
  res.status(201).json(result);
});

app.put('/api/skills/:id', async (req, res) => {
  const { id } = req.params;
  const { name, level, icon } = req.body;
  const updateDoc = { $set: { name, level: Number(level), icon } };
  const result = await skillsCollection.updateOne({ _id: new ObjectId(id) }, updateDoc);
  res.json(result);
});

app.delete('/api/skills/:id', async (req, res) => {
  const { id } = req.params;
  const result = await skillsCollection.deleteOne({ _id: new ObjectId(id) });
  res.json(result);
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
