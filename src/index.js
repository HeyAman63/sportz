import express from 'express';

const app = express();

// Use JSON middleware
app.use(express.json());

// Root GET route
app.get('/', (req, res) => {
    res.send('Welcome to the Sportz Server!');
});

// Listen on port 8000
const port = 8000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});