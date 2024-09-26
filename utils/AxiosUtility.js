require('dotenv').config();
const path = require("path");
const fs = require('fs');
const https = require('https');
const { default: axios } = require("axios");

__dirname = path.resolve('./');

const certificate = fs.readFileSync(path.join(__dirname, '/keys/sandbox-cert.cer'));

const agent = new https.Agent({
  rejectUnauthorized: true,
  cert: certificate,
});


const AxiosUtility = axios.create({
  httpsAgent: agent,
  baseURL: `${process.env.MPESA_BASE_URL}`,
  headers: {
    accept: 'application/json',
  },
});

module.exports = AxiosUtility;