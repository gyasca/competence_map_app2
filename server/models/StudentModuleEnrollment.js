module.exports = (sequelize, DataTypes) => {
    const StudentModuleEnrollment = sequelize.define("StudentModuleEnrollment", {
      adminNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      moduleCode: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      academicYear: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      semester: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      grade: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    });
  
    StudentModuleEnrollment.associate = (models) => {
      StudentModuleEnrollment.belongsTo(models.User, {
        foreignKey: "adminNumber",
      });
      StudentModuleEnrollment.belongsTo(models.Module, {
        foreignKey: "moduleCode",
      });
    };
  
    return StudentModuleEnrollment;
  };