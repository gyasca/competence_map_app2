module.exports = (sequelize, DataTypes) => {
  const CourseModule = sequelize.define("CourseModule", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    levelOfStudy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    complexityLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    prevModuleCodes: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    nextModuleCodes: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    courseCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    moduleCode: {
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