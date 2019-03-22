#!/usr/bin/env node
const dotenv = require('dotenv');
dotenv.config();

require = require('esm')(module /*, options*/);

require('./server');

