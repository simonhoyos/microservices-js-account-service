import { createApp } from './app.ts';

createApp()
  .then(({ app, port }) => {
    app.listen(port, () => {
      /* eslint-disable-next-line no-console */
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    /* eslint-disable-next-line no-console */
    console.error('Failed to start server', error);

    throw error;
  });
