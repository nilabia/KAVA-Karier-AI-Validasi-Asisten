const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');
const { analyzeCV, getHistory, getAnalysisDetail, getCareerAdvice, deleteAnalysis } = require('../handlers/CvAnalysisHandler');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `cv-${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files are allowed'), false);
  },
});

router.post('/analyze', authMiddleware, upload.single('cv'), analyzeCV);
router.get('/history', authMiddleware, getHistory);
router.get('/history/:id', authMiddleware, getAnalysisDetail);
router.get('/advice/:id', authMiddleware, getCareerAdvice);
router.delete('/history/:id', authMiddleware, deleteAnalysis);
module.exports = router;