import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  HasManyAddAssociationMixin
} from 'sequelize';
import db from '@src/db';
import Session from '@src/models/session.model';

export interface UserAttributes {
  name: string;
  email: string;
  password: string;
  description: string;
  profileImg: string;
}

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> implements UserAttributes {
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare password: string;
  declare description: string;
  declare profileImg: CreationOptional<string>;

  declare addSession: HasManyAddAssociationMixin<Session, number>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
      // unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    profileImg: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    timestamps: true,
    sequelize: db.sequelize,
    tableName: 'users',
    indexes: [
      {
        unique: true,
        fields: ['email']
      }
    ]
    // paranoid: true, // soft delete
  }
);

User.hasMany(Session, {
  as: 'sessions',
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});

export default User;
