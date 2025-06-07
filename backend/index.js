const express = require("express");
const cors = require("cors");
const analyzeRoutes = require("./routes/analyzeRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", analyzeRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
