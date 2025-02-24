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
    console.error('Error while running server', error);

    throw error;
  });
