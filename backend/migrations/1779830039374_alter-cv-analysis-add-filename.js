exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('cv_analysis', {
    cv_filename: {
      type: 'VARCHAR(255)',
      default: null,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('cv_analysis', ['cv_filename']);
};