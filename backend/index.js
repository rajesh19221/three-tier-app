const tasks = require("./routes/tasks");
const connection = require("./db");
const cors = require("cors");
const express = require("express");
const app = express();
connection();
app.use(express.json());
app.use(cors());
app.get('/ok', (req, res) => {
    res.status(200).send('ok')
});
app.get('/api/version', (req, res) => {
    res.json({ version: "3.0"', status: 'Backend Latest!' });
});
app.use("/api/tasks", tasks);
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
// SonarQube test v3
