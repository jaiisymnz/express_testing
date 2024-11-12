import express from "express";
import postRouter from "./routues/posts.mjs";

const app = express();
const port = process.env.PORT || 4001;
app.use(express.json());

app.use("/posts", postRouter);

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
