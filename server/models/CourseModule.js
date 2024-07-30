module.exports = (sequelize, DataTypes) => {
    const CourseModule = sequelize.define("CourseModule", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // You can add other attributes specific to the course-module relationship here
    });
  
    // External attributes that will appear in CourseModule table
    CourseModule.associate = function(models) {
      CourseModule.belongsTo(models.Course, {
        foreignKey: 'courseId',
        allowNull: false
      });
      CourseModule.belongsTo(models.Module, {
        foreignKey: 'moduleId',
        allowNull: false
      });
      CourseModule.hasMany(models.CompetencyMapModule, {
        foreignKey: 'courseModuleId'
      });
    };
  
    return CourseModule;
  };