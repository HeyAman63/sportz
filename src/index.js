import express from 'express';
import { matchRouter } from './routes/matches.js';

const app = express();

// Use JSON middleware
app.use(express.json());

// Root GET route
app.get('/', (req, res) => {
    res.send('Welcome to the Sportz Server!');
});

app.use("/matches",matchRouter);

// Listen on port 8000
const port = 8000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});