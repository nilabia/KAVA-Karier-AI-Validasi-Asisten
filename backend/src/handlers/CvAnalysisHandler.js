const FormData = require('form-data');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const fs = require('fs');
const CvAnalysisService = require('../services/CvAnalysisService');
const ClientError = require('../exceptions/ClientError');

const CV_EXTRACTOR_URL = process.env.CV_EXTRACTOR_URL 
const AI_MODEL_URL = process.env.AI_MODEL_URL 

async function analyzeCV(req, res, next) {
  try {
    if (!req.file) throw new ClientError('No CV file uploaded', 400);

    const form = new FormData();
    form.append('file', fs.createReadStream(req.file.path), {
      filename: req.file.originalname,
      contentType: 'application/pdf',
    });

    const extractRes = await fetch(`${CV_EXTRACTOR_URL}/extract`, {
      method: 'POST',
      body: form,
      headers: form.getHeaders(),
    });
    const extractJson = await extractRes.json();

    if (!extractRes.ok || extractJson.status !== 'success') {
      throw new ClientError(extractJson.message || 'CV extraction failed', 422);
    }

    const extractedData = extractJson.data;

    const modelPayload = {
      text: extractedData.summary || extractedData.highlights || extractedData.skills || '',
      skills_raw: (extractedData.skills_list || []).join(', '),
      experience_years: Math.min(Number(extractedData.experience_years) || 0, 40),
      cert_count: (extractedData.certification || []).length,
      has_education: extractedData.education ? 1 : 0,
    };

    console.log('[AI Model] Sending payload:', modelPayload);

    const modelRes = await fetch(`${AI_MODEL_URL}/api/predict-career`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(modelPayload),
      signal: AbortSignal.timeout(30000),
    });

    const modelJson = await modelRes.json();
    console.log('[AI Model] Response:', JSON.stringify(modelJson).slice(0, 300));

    if (!modelRes.ok) throw new ClientError('AI model prediction failed', 502);

    const topRoles = modelJson.top3_role_matches || [];
    const skillGap = modelJson.skill_gap || {};
    const careerAdvice = modelJson.ai_career_coach || null;

    if (topRoles.length === 0) throw new ClientError('No career roles predicted', 502);

    const analysis = await CvAnalysisService.saveAnalysis({
      userId: req.user.id,
      topRoles,
      skillGap,
      extractedData,
      careerAdvice,
    });

    fs.unlink(req.file.path, () => {});

    res.status(201).json({
      status: 'success',
      message: 'CV analyzed successfully',
      data: { analysis },
    });
  } catch (error) {
    if (req.file?.path) fs.unlink(req.file.path, () => {});
    next(error);
  }
}

async function getHistory(req, res, next) {
  try {
    const analyses = await CvAnalysisService.getHistoryByUserId(req.user.id);
    res.status(200).json({ status: 'success', data: { analyses } });
  } catch (error) {
    next(error);
  }
}

async function getAnalysisDetail(req, res, next) {
  try {
    const analysis = await CvAnalysisService.getAnalysisById(req.params.id, req.user.id);
    res.status(200).json({ status: 'success', data: { analysis } });
  } catch (error) {
    next(error);
  }
}

async function getCareerAdvice(req, res, next) {
  try {
    const analysis = await CvAnalysisService.getAnalysisById(req.params.id, req.user.id);
    res.status(200).json({
      status: 'success',
      data: { career_advice: analysis.career_advice },
    });
  } catch (error) {
    next(error);
  }
}

async function deleteAnalysis(req, res, next) {
  try {
    await CvAnalysisService.deleteAnalysis(req.params.id, req.user.id);
    res.status(200).json({ status: 'success', message: 'Analysis deleted successfully' });
  } catch (error) {
    next(error);
  }
}


module.exports = { analyzeCV, getHistory, getAnalysisDetail, getCareerAdvice, deleteAnalysis };