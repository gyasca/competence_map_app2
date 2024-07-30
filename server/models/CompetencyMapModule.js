module.exports = (sequelize, DataTypes) => {
    const CompetencyMapModule = sequelize.define("CompetencyMapModule", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      row: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      column: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      prevModuleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      nextModuleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      competencyMapId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      courseModuleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  
    CompetencyMapModule.associate = function (models) {
      CompetencyMapModule.belongsTo(models.CompetencyMap, {
        foreignKey: 'competencyMapId',
        as: 'competencyMap'
      });
      CompetencyMapModule.belongsTo(models.CourseModule, {
        foreignKey: 'courseModuleId',
        as: 'courseModule'
      });
    };
  
    return CompetencyMapModule;
  };