const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const User = sequelize.define('User', {
  uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4, // generates UUID
    allowNull: false,
    unique: true
  }
});

const Job = sequelize.define('Job', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  salary_min: {
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  salary_max: {
    type: DataTypes.DECIMAL,
    allowNull: false
  }
});

// User —> save multiple jobs
User.hasMany(Job, { onDelete: 'CASCADE' });
Job.belongsTo(User);

module.exports = { User, Job };