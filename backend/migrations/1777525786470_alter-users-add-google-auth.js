exports.up = (pgm) => {
  pgm.addColumn('users', {
    google_id: {
      type: 'VARCHAR(100)',
      unique: true,
    },
    auth_provider: {
      type: 'VARCHAR(20)',
      notNull: true,
      default: "'local'",
    },
  });

  pgm.alterColumn('users', 'password', {
    notNull: false,
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('users', 'google_id');
  pgm.dropColumn('users', 'auth_provider');
  pgm.alterColumn('users', 'password', { notNull: true });
};