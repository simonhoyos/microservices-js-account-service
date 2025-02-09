import express from 'express';

// import { connect } from './database.ts';

const app = express();
// const connectionPool = connect({ environment: 'development' });

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

export { app };
