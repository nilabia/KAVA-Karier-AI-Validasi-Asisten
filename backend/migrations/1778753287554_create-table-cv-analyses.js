exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('cv_analysis', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    top_roles: {
      type: 'JSONB',
      notNull: true,
    },
    skill_gap: {
      type: 'JSONB',
      notNull: true,
    },
    extracted_data: {
      type: 'JSONB',
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('cv_analysis');
};