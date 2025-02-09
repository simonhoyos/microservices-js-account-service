import { app } from './app.ts';

const port = process.env.PORT || 9000;

app.listen(port, () => {
  /* eslint-disable-next-line no-console */
  console.log(`Server is running on http://localhost:${port}`);
});
