import { DataTypes, Model, Sequelize } from 'sequelize';

// ✅ Export a function that accepts a Sequelize instance
export default (sequelize: Sequelize) => {
  class Task extends Model {
    public id!: number;
    public title!: string;
    public description?: string;
    public isComplete!: boolean;
    public userId!: number;
  }

  Task.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isComplete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize, // ✅ Pass initialized sequelize instance
      modelName: 'Task',
      tableName: 'tasks',
      timestamps: true,
    }
  );

  return Task;
};
