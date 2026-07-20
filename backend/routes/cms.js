const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const WebsiteSection = require('../models/WebsiteSection');
const CmsSettings = require('../models/CmsSettings');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// All CMS routes require authentication and admin role
router.use(auth);
router.use(admin);

// Configure multer for CMS image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/cms/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'cms-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const allowedMimes = /image\/(jpeg|jpg|png|webp|gif|svg\+xml)/;
    const mimetype = allowedMimes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpg, png, webp, gif, svg)!'));
    }
  }
});

// ─── CMS Settings ───────────────────────────────────────────────────────────

// GET site settings (singleton)
router.get('/settings', async (req, res) => {
  try {
    let settings = await CmsSettings.findOne();
    if (!settings) {
      settings = await CmsSettings.create({});
    }
    res.json(settings);
  } catch (error) {
    console.error('CMS get settings error:', error);
    res.status(500).json({ message: 'Failed to fetch settings', error: error.message });
  }
});

// PUT update site settings (upsert singleton)
router.put('/settings', async (req, res) => {
  try {
    let settings = await CmsSettings.findOne();
    if (!settings) {
      settings = new CmsSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.json({ message: 'Settings saved successfully', settings });
  } catch (error) {
    console.error('CMS update settings error:', error);
    res.status(500).json({ message: 'Failed to update settings', error: error.message });
  }
});

// ─── Image Upload ─────────────────────────────────────────────────────────────

// Upload single or multiple images to CMS
router.post('/upload', upload.array('images', 20), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    const files = req.files.map(file => {
      // Sanitize SVG files to prevent XSS
      if (file.mimetype === 'image/svg+xml') {
        const filePath = path.join(file.destination, file.filename);
        const svgContent = fs.readFileSync(filePath, 'utf8');
        // Sanitize with SVG profile and return trusted string
        const cleanSvg = DOMPurify.sanitize(svgContent, { USE_PROFILES: { svg: true } });
        fs.writeFileSync(filePath, cleanSvg, 'utf8');
        file.size = Buffer.byteLength(cleanSvg, 'utf8');
      }

      return {
        url: 'uploads/cms/' + file.filename,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        uploadedAt: new Date()
      };
    });
    res.json({ message: 'Files uploaded successfully', files });
  } catch (error) {
    console.error('CMS upload error:', error);
    res.status(500).json({ message: 'File upload failed', error: error.message });
  }
});

// ─── Media Library ────────────────────────────────────────────────────────────

// GET all media files
router.get('/media', async (req, res) => {
  try {
    const { search, page = 1, limit = 50 } = req.query;
    const uploadDir = path.join(__dirname, '..', 'uploads', 'cms');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      return res.json({ files: [], total: 0 });
    }

    let files = fs.readdirSync(uploadDir)
      .filter(f => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(f))
      .map(filename => {
        const stat = fs.statSync(path.join(uploadDir, filename));
        return {
          filename,
          url: 'uploads/cms/' + filename,
          size: stat.size,
          uploadedAt: stat.mtime
        };
      })
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    if (search) {
      files = files.filter(f => f.filename.toLowerCase().includes(search.toLowerCase()));
    }

    const total = files.length;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const paginated = files.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    res.json({ files: paginated, total, totalPages: Math.ceil(total / limitNum), currentPage: pageNum });
  } catch (error) {
    console.error('CMS media list error:', error);
    res.status(500).json({ message: 'Failed to list media', error: error.message });
  }
});

// DELETE media file
router.delete('/media/:filename', (req, res) => {
  try {
    const filePath = path.join(__dirname, '..', 'uploads', 'cms', req.params.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'File deleted successfully' });
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    console.error('CMS media delete error:', error);
    res.status(500).json({ message: 'Failed to delete file', error: error.message });
  }
});

// ─── Section Reorder ──────────────────────────────────────────────────────────

// PUT reorder sections (accepts array of { id, order })
router.put('/sections/reorder', async (req, res) => {
  try {
    const { sections } = req.body; // [{ id, order }, ...]
    if (!Array.isArray(sections)) {
      return res.status(400).json({ message: 'sections must be an array' });
    }
    const updates = sections.map(({ id, order }) =>
      WebsiteSection.findByIdAndUpdate(id, { order }, { new: true })
    );
    await Promise.all(updates);
    res.json({ message: 'Sections reordered successfully' });
  } catch (error) {
    console.error('CMS reorder error:', error);
    res.status(500).json({ message: 'Failed to reorder sections', error: error.message });
  }
});

// ─── Sections by Type ─────────────────────────────────────────────────────────

// GET sections by type (for focused managers)
router.get('/sections/type/:type', async (req, res) => {
  try {
    const sections = await WebsiteSection.find({ sectionType: req.params.type })
      .sort({ order: 1, createdAt: -1 })
      .lean();
    res.json({ sections: sections || [] });
  } catch (error) {
    console.error('CMS get by type error:', error);
    res.status(500).json({ message: 'Failed to fetch sections', error: error.message });
  }
});

// GET section by key
router.get('/sections/key/:key', async (req, res) => {
  try {
    let section = await WebsiteSection.findOne({ sectionKey: req.params.key });
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.json(section);
  } catch (error) {
    console.error('CMS get by key error:', error);
    res.status(500).json({ message: 'Failed to fetch section', error: error.message });
  }
});

// PUT upsert section by key (create if missing, update if exists)
router.put('/sections/key/:key', async (req, res) => {
  try {
    const section = await WebsiteSection.findOneAndUpdate(
      { sectionKey: req.params.key },
      req.body,
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ message: 'Section saved successfully', section });
  } catch (error) {
    console.error('CMS upsert section error:', error);
    res.status(500).json({ message: 'Failed to save section', error: error.message });
  }
});

module.exports = router;
