const express = require("express");
const app = express();
const port = 3000;

const productsRouter = require("./routers/products.router.js");

app.use(express.json());
app.use("/api", productsRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
