#!/usr/bin/env node

import './lib/setup-mongoose';
import app from './lib/app';
const port = process.env.PORT || process.argv[2] || 9000;

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});