class UploadController {
  async uploadSingle(req, res) {
    try {
      if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

      // Cloudinary returns URL in 'path', local multer returns filename in 'filename'
      const fileUrl = req.file.path ? req.file.path : `/uploads/${req.file.filename}`;
      
      res.status(201).json({
        message: 'File uploaded successfully',
        url: fileUrl,
        filename: req.file.filename || req.file.public_id,
        id: req.file.public_id || req.file.filename
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async uploadMultiple(req, res) {
    try {
      if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'No files uploaded' });

      const files = req.files.map(file => ({
        url: file.path ? file.path : `/uploads/${file.filename}`,
        filename: file.filename || file.public_id,
        id: file.public_id || file.filename
      }));

      res.status(201).json({
        message: `${files.length} files uploaded successfully`,
        files
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default new UploadController();
