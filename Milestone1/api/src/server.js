const express = require('express');

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

const apiRouter = require('./routes/apiRouter');

app.get('/', (req, res) => {
    res.json("made it");
})

app.use('/v1', apiRouter);

// As our server to listen for incoming connections
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));