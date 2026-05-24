exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('cv_analysis', {
    career_advice: {
      type: 'TEXT',
      default: null,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('cv_analysis', ['career_advice']);
};