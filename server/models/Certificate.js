module.exports = (sequelize, DataTypes) => {
    const Certificate = sequelize.define("Certificate", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      moduleCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      issueDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      expiryDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      issuedBy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    Certificate.associate = (models) => {
      Certificate.belongsTo(models.Module, {
        foreignKey: "moduleCode",
      });
    };
  
    return Certificate;
  };