import express from 'express';

const port = process.env.PORT || 9000;
const app = express();

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
