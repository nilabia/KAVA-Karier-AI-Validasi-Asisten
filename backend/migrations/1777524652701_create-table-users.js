exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'VARCHAR(100)',
      notNull: true,
    },
    email: {
      type: 'VARCHAR(100)',
      notNull: true,
      unique: true,
    },
    password: {
      type: 'TEXT',
      notNull: false,
    },
    google_id: {
      type: 'VARCHAR(100)',
      unique: true,
    },
    auth_provider: {
      type: "VARCHAR(20)",
      notNull: true,
      default: "'local'",  // 'local' atau 'google'
    },
    is_verified: {
      type: 'BOOLEAN',
      notNull: true,
      default: false,
    },
    verification_code: {
      type: 'VARCHAR(10)',
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('CURRENT_TIMESTAMP'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};