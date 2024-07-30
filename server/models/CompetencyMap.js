module.exports = (sequelize, DataTypes) => {
  const CompetencyMap = sequelize.define("CompetencyMap", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Don't need to define as it is defined through associations.
    // courseId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
  });

  CompetencyMap.associate = function (models) {
    CompetencyMap.belongsTo(models.Course, {
      foreignKey: "courseId",
      as: "course",
    });
    CompetencyMap.hasMany(models.CompetencyMapModule, {
      foreignKey: "competencyMapId",
      as: "modules",
    });
  };

  return CompetencyMap;
};
