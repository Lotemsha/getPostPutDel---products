const express = require("express");
const app = express();
const userRoutes = require("./routes/users");
const productsRoutes = require("./routes/product");
const port = 3000;

app.use(express.json());

app.use("/users", userRoutes);
app.use("/products", productsRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
