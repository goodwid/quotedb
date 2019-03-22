#!/usr/bin/env node
const dotenv = require('dotenv');
dotenv.config();

// eslint-disable-next-line no-global-assign
require = require('esm')(module /*, options*/);

require('./server');

