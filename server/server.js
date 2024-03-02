import dotenv from "dotenv";
dotenv.config();

import express, { json } from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const PORT = 5000;
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;

import Todo from "./models/Todo.js";

mongoose.connect(DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use(cors());
app.use(json());

app.get("/api/todo", async (req, res) => {
  try {
    const todos = await Todo.find({});
    res.status(200).json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Unable to fetch todos" });
  }
});

app.get("/api/todo/:id", async (req, res) => {
  try {
    const todoId = req.params.id;
    const todo = await Todo.findById(todoId);

    if (todo) {
      res.status(200).json(todo);
    } else {
      res.status(404).json({ error: "Todo not found" });
    }
  } catch (error) {
    console.error("Error fetching todo by ID:", error);
    res.status(500).json({ error: "Unable to fetch todo" });
  }
});

app.post("/api/todo", async (req, res) => {
  try {
    const { title, comment } = req.body;

    const newTodo = new Todo({ title, comment });

    await newTodo.save();

    res.status(201).json(newTodo);
  } catch (error) {
    console.error("Error creating a new todo:", error);
    res.status(500).json({ error: "Unable to create a new todo" });
  }
});

app.put("/api/todo/:id", async (req, res) => {
  const todoId = req.params.id;
  const updatedData = req.body;

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(todoId, updatedData, { new: true });
    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(updatedTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to update the todo" });
  }
});

app.delete("/api/todo/:id", async (req, res) => {
  try {
    const todoId = req.params.id;
    const deletedTodo = await Todo.findByIdAndRemove(todoId);
    if (deletedTodo) {
      res.status(200).json(deletedTodo);
    } else {
      res.status(404).json({ error: "Todo not found" });
    }
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Unable to delete todo" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
