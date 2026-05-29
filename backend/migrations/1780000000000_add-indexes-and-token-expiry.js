exports.up = (pgm) => {
  pgm.addColumn('authentications', {
    expires_at: {
      type: 'timestamptz',
      notNull: false,
    },
  });

  pgm.createIndex('users', 'email', { unique: true, ifNotExists: true });

  pgm.createIndex('users', 'google_id', { ifNotExists: true });

  pgm.createIndex('users', 'reset_token', { ifNotExists: true });

  pgm.createIndex('cv_analysis', 'user_id', { ifNotExists: true });

  pgm.createIndex('cv_analysis', 'created_at', { ifNotExists: true });
};

exports.down = (pgm) => {
  pgm.dropIndex('users', 'email');
  pgm.dropIndex('users', 'google_id');
  pgm.dropIndex('users', 'reset_token');
  pgm.dropIndex('cv_analysis', 'user_id');
  pgm.dropIndex('cv_analysis', 'created_at');
  pgm.dropColumn('authentications', 'expires_at');
};