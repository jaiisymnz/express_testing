import express from "express";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = process.env.PORT || 4001;
app.use(express.json());

// VIew all posts
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

// Creat new post
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

// View post by ID
app.get("/posts/:postId", async (req, res) => {
  const postIdFromClient = req.params.postId;
  let result;
  try {
    result = await connectionPool.query(`SELECT * FROM posts WHERE id = $1`, [
      postIdFromClient,
    ]);
  } catch {
    return res.status(500).json({
      message: `Server could not create post because database connection`,
    });
  }
  if (!result.rows[0]) {
    return res.status(404).json({
      message: `Server could not find a requested post`,
    });
  }
  return res.status(200).json({ data: result.rows[0] });
});

//Edit post by ID
app.put("/posts/:postId", async (req, res) => {
  const postIDFromClient = req.params.postId;
  const updatedPost = req.body;

  try {
    const result = await connectionPool.query(
      `UPDATE posts
       SET title = $2, 
           image = $3, 
           category_id = $4, 
           description = $5, 
           content = $6, 
           status_id = $7
       WHERE id = $1`,
      [
        postIDFromClient,
        updatedPost.title,
        updatedPost.image,
        updatedPost.category_id,
        updatedPost.description,
        updatedPost.content,
        updatedPost.status_id,
      ]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Server could not find the requested post" });
    }
  } catch (error) {
    return res.status(500).json({
      message: `Server could not update post due to a database connection issue`,
      error: error.message,
    });
  }

  return res.status(200).json({ message: "Updated post successfully" });
});

//Delete post by ID
app.delete("/posts/:postId", async (req, res) => {
  const postIDFromClient = req.params.postId;

  try {
    const result = await connectionPool.query(
      `DELETE FROM posts WHERE id = $1 RETURNING *`,
      [postIDFromClient]
    );

    // ตรวจสอบว่ามีโพสต์ที่ถูกลบหรือไม่
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Server could not find a requested post to delete" });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Server could not delete post because database connection",
      error: error.message, // เพิ่มรายละเอียดข้อผิดพลาด
    });
  }

  return res.status(200).json({
    message: "Post deleted successfully",
  });
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
