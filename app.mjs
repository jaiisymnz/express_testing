import express from "express";
import connectionPool from "./utils/db.mjs";

const app = express();

const port = process.env.PORT || 4000;
app.use(express.json());

app.get("/posts", async (req, res) => {
  let result;
  try {
    result = await connectionPool.query(`SELECT * FROM posts`);
  } catch {
    return res.status(500).json({
      message: `Server could not create post because database connection`,
    });
  }

  return res.status(201).json({ data: result.rows });
});

app.post("/posts", async (req, res) => {
  const newPost = req.body;
  try {
    const query = `INSERT INTO posts (title, image, category_id, description, content, status_id)
    VALUES ($1, $2, $3, $4, $5, $6)`;
    const values = [
      newPost.title,
      newPost.image,
      newPost.category_id,
      newPost.description,
      newPost.content,
      newPost.status_id,
    ];
    await connectionPool.query(query, values);
    
  } catch {
    return res.status(500).json({
      message: `Server could not create post because database connection`,
    });
  }

  return res.status(201).json({ message: "Created post successfully" });
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
