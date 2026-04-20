class UploadController {
  async uploadSingle(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // In production, you would upload to Cloudinary/S3 here
      // For now, return the local server path
      const fileUrl = `/uploads/${req.file.filename}`;
      
      res.status(201).json({
        message: 'File uploaded successfully',
        url: fileUrl,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async uploadMultiple(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
      }

      const files = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size
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
