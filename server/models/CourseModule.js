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
    levelOfStudy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    competencyLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    prevModuleCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nextModuleCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    courseCode: {
      // Add this field
      type: DataTypes.STRING,
      allowNull: false,
    },
    moduleCode: {
      // Add this field
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  CourseModule.associate = function (models) {
    CourseModule.belongsTo(models.Course, {
      foreignKey: "courseCode",
      targetKey: "courseCode",
    });
    CourseModule.belongsTo(models.Module, {
      foreignKey: "moduleCode",
      targetKey: "moduleCode",
    });
  };

  return CourseModule;
};
