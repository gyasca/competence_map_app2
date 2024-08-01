module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define("Course", {
    courseCode: {
      type: DataTypes.STRING,
      primaryKey: true,
      // autoIncrement: true,
    },
    //   courseCode: {
    //     type: DataTypes.STRING,
    //     allowNull: false,
    //   },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  Course.associate = (models) => {
    // Course.belongsToMany(models.Module, {
    //   through: models.CourseModule,
    //   foreignKey: "courseCode",
    //   otherKey: "moduleCode",
    // });
    Course.belongsToMany(models.Module, {
      through: models.CourseModule,
      foreignKey: "courseCode",
    });
    Course.hasOne(models.CompetencyMap, { foreignKey: "courseCode" });
    Course.hasMany(models.CourseEnrollment, { foreignKey: "courseCode" });
  };

  return Course;
};
