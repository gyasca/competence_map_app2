module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('student', 'staff'),
      allowNull: false,
    },
    profilePictureFilePath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Student attributes
    adminNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    course: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    yearJoined: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // Staff attributes
    staffId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Resume, {
      foreignKey: "userId",
      onDelete: "cascade"
    });
    User.hasMany(models.StudentModuleEnrollment, {
      foreignKey: "userId",
      onDelete: "cascade"
    });
  };

  return User;
};