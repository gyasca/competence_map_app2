module.exports = (sequelize, DataTypes) => {
  const StudentModuleEnrollment = sequelize.define("StudentModuleEnrollment", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.ENUM('enrolled', 'in_progress', 'completed', 'failed'),
      defaultValue: 'enrolled',
      allowNull: false,
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    completionDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  StudentModuleEnrollment.associate = function(models) {
    StudentModuleEnrollment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'student',
      allowNull: false
    });
    StudentModuleEnrollment.belongsTo(models.CourseModule, {
      foreignKey: 'courseModuleId',
      allowNull: false
    });
    StudentModuleEnrollment.belongsTo(models.CourseEnrollment, {
      foreignKey: 'courseEnrollmentId',
      allowNull: false
    });
  };

  return StudentModuleEnrollment;
};