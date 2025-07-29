import { v2 as cloudinary } from "cloudinary";

import { config } from "dotenv";

config();

cloudinary.config({
  cloud_name: 'dtmrwsnag', 
  api_key: '198325265568559', 
  api_secret: 'Ad-5fBJUH3OcFvnSTj6cEXJG2G4'
});

export default cloudinary;