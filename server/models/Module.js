module.exports = (sequelize, DataTypes) => {
  const Module = sequelize.define("Module", {
    moduleCode: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    school: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    credit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    certifications: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("certifications");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue("certifications", JSON.stringify(value));
      },
    },
    // moved to courseModule model
    // prevModule: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // nextModule: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    
  });

  Module.associate = (models) => {
    // Module.hasMany(models.StudentModuleEnrollment, {
    //   foreignKey: "moduleCode",
    //   onDelete: "cascade",
    // });
    Module.hasMany(models.Certificate, {
      foreignKey: "moduleCode",
      onDelete: "cascade",
    });
    Module.belongsToMany(models.Course, {
      through: models.CourseModule,
      foreignKey: "moduleCode",
    });
    // Module.hasMany(models.CompetencyMapModule, {
    //   foreignKey: "moduleCode",
    //   onDelete: "cascade",
    // });
  };

  return Module;
};
