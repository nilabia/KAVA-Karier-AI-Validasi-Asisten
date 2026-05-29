const { v4: uuidv4 } = require("uuid");
const pool = require("../utils/database");
const NotFoundError = require("../exceptions/NotFoundError");

const CvAnalysisService = {
  async saveAnalysis({ userId, topRoles, skillGap, extractedData, careerAdvice, cvFilename }) {
    const id = uuidv4();
    const result = await pool.query(
      `INSERT INTO cv_analysis (id, user_id, top_roles, skill_gap, extracted_data, career_advice, cv_filename)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, user_id, top_roles, skill_gap, extracted_data, career_advice, cv_filename, created_at`,
      [id, userId, JSON.stringify(topRoles), JSON.stringify(skillGap), JSON.stringify(extractedData), careerAdvice, cvFilename]
    );
    return result.rows[0];
  },

  async getHistoryByUserId(userId, { page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;

    const countResult = await pool.query(
      'SELECT COUNT(*) FROM cv_analysis WHERE user_id = $1',
      [userId]
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const result = await pool.query(
      `SELECT id, top_roles, skill_gap, extracted_data, career_advice, cv_filename, created_at
       FROM cv_analysis WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    return {
      analyses: result.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getAnalysisById(id, userId) {
    const result = await pool.query(
      'SELECT id, top_roles, skill_gap, extracted_data, career_advice, cv_filename, created_at FROM cv_analysis WHERE id = $1 AND user_id = $2',
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