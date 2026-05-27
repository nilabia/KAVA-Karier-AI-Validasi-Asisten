const  {v4: uuidv4 } = require("uuid");
const pool =require("../utils/database");
const NotFoundError = require("../exceptions/NotFoundError");

const CvAnalysisService = {
    async saveAnalysis({ userId, topRoles, skillGap, extractedData, careerAdvice }) {
    const id = uuidv4();
    const result = await pool.query(
        `INSERT INTO cv_analysis (id, user_id, top_roles, skill_gap, extracted_data, career_advice)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, user_id, top_roles, skill_gap, extracted_data, career_advice, created_at`,
        [id, userId, JSON.stringify(topRoles), JSON.stringify(skillGap), JSON.stringify(extractedData), careerAdvice]
    );
    return result.rows[0];
    },  

    async getHistoryByUserId(userId) {
    const result = await pool.query(
        'SELECT id, top_roles, skill_gap, extracted_data, career_advice, created_at FROM cv_analysis WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
    );
    return result.rows;
    },

    async getAnalysisById(id, userId) {
    const result = await pool.query(
        'SELECT id, top_roles, skill_gap, extracted_data, career_advice, created_at FROM cv_analysis WHERE id = $1 AND user_id = $2',
        [id, userId]
    );
    if (result.rows.length === 0) throw new NotFoundError('CV analysis not found');
    return result.rows[0];
  },

    async deleteAnalysis(id, userId) {
    const result = await pool.query(
        'DELETE FROM cv_analysis WHERE id = $1 AND user_id = $2 RETURNING id',
        [id, userId]
    );
    if (result.rows.length === 0) throw new NotFoundError('CV analysis not found');
    },
};

module.exports = CvAnalysisService;
            