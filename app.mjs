import express from "express"

const app = express();

const port = process.env.PORT || 4000;

app.get("/profiles", (req, res) => {
  return res.json({
    data: {
      name: "john",
      age: 20,
    },
  });
});

app.listen(port,()=>{
          console.log(`Server is running at port ${port}`);
})