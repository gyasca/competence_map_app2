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
    levelOfStudy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    certifications: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('certifications');
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(value) {
        this.setDataValue('certifications', JSON.stringify(value));
      }
    },
    prerequisite: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    prevModule: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nextModule: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    competencyLevel: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Module.associate = (models) => {
    Module.hasMany(models.StudentModuleEnrollment, {
      foreignKey: "moduleCode",
      onDelete: "cascade",
    });
    Module.hasMany(models.Certificate, {
      foreignKey: "moduleCode",
      onDelete: "cascade",
    });
  };

  return Module;
};