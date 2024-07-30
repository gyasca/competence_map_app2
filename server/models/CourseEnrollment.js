module.exports = (sequelize, DataTypes) => {
    const CourseEnrollment = sequelize.define("CourseEnrollment", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      yearOfStudy: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  
    CourseEnrollment.associate = (models) => {
      CourseEnrollment.belongsTo(models.User, { foreignKey: 'userId' });
      CourseEnrollment.belongsTo(models.Course, { foreignKey: 'courseId' }); // Match foreign key
    };
  
    return CourseEnrollment;
  };
  