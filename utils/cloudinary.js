require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploads = async (fileLocation, folderId, filename) => {
  return await cloudinary.uploader.upload(fileLocation, {
    resource_type: "auto",
    public_id: `customer/${folderId}/reports/${filename}`,
  });
};

module.exports = { cloudinary, uploads };
