const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

const uploadToImageKit = (folder) => async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  try {
    const uploadPromises = req.files.map(file => {
      return imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
        folder: folder
      });
    });

    const results = await Promise.all(uploadPromises);

    // Map ImageKit responses back to req.files so controllers work seamlessly
    req.files = req.files.map((file, index) => {
      return {
        ...file,
        path: results[index].url,
        fileId: results[index].fileId,
      };
    });

    next();
  } catch (error) {
    console.error("ImageKit upload error:", error);
    res.status(500).json({ message: "Image upload failed", error: error.message });
  }
};

module.exports = { imagekit, uploadToImageKit };
