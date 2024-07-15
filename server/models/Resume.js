module.exports = (sequelize, DataTypes) => {
  const Resume = sequelize.define("Resume", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    adminNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    certificateIds: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    pdfDetails: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    creationDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    lastModifiedDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  Resume.associate = (models) => {
    Resume.belongsTo(models.User, {
      foreignKey: "adminNumber",
      targetKey: "userId",
    });
  };

  return Resume;
};