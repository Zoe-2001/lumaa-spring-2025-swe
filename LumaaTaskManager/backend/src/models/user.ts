import { DataTypes, Model, Sequelize, Optional } from 'sequelize';


interface UserAttributes {
  id: number;
  username: string;
  password: string;
}
interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// ✅ Export a function that accepts a Sequelize instance
export default (sequelize: Sequelize) => {
  class User extends Model<UserAttributes, UserCreationAttributes> {
    public id!: number;
    public username!: string;
    public password!: string;
  }


  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize, // ✅ Pass initialized sequelize instance
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
    }
  );

  return User;
};
