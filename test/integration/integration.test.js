const chai = require('chai');
const chaiHttp = require('chai-http');
require ('../../lib/setup-mongoose');
const app = require('../../lib/app');
const User = require('../../models/user');
const token = require('../../lib/token');

const assert = chai.assert;
chai.use(chaiHttp);