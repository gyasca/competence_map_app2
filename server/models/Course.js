module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define("Course", {
      courseId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
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
      Course.belongsToMany(models.Module, { through: models.CourseModule });
      Course.hasOne(models.CompetencyMap, { foreignKey: 'courseId' });
      Course.hasMany(models.CourseEnrollment, { foreignKey: 'courseId' });
    };
  
    return Course;
  };
  