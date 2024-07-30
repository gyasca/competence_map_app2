module.exports = (sequelize, DataTypes) => {
    const ObtainedCertification = sequelize.define("ObtainedCertification", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      dateObtained: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  
    ObtainedCertification.associate = (models) => {
      ObtainedCertification.belongsTo(models.User, { foreignKey: 'userId' });
      ObtainedCertification.belongsTo(models.Certificate);
    };
  
    return ObtainedCertification;
  };