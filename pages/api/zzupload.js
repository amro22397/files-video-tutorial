// import nextConnect from 'next-connect';
// import multer from 'multer';
// import cloudinary from '../../lib/cloudinary';

// const upload = multer({ dest: 'uploads/' });

// const apiRoute = nextConnect({
//   onError(error, req, res) {
//     res.status(500).json({ error: `Something went wrong: ${error.message}` });
//   },
//   onNoMatch(req, res) {
//     res.status(405).json({ error: `Method ${req.method} not allowed` });
//   },
// });

// apiRoute.use(upload.single('video')); // 'video' is the field name

// apiRoute.post(async (req, res) => {
//   try {
//     const file = req.file;

//     // Upload video to Cloudinary
//     const uploadResponse = await cloudinary.uploader.upload(file.path, {
//       resource_type: 'video', // Specify the type as video
//     });

//     res.status(200).json({ url: uploadResponse.secure_url });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// export default apiRoute;

// export const config = {
//   api: {
//     bodyParser: false, // Disable default body parser for multer
//   },
// };
