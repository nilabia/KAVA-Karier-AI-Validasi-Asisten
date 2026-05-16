exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('users', {
    reset_token: {
      type: 'VARCHAR(255)',
      default: null,
    },
    reset_token_expires: {
      type: 'TIMESTAMPTZ',
      default: null,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('users', ['reset_token', 'reset_token_expires']);
};