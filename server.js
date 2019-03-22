import './lib/setup-mongoose';

import app from './lib/app';
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});