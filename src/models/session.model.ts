import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import db from '@src/db';

export interface SessionAttributes {
  token: string;
}

class Session
  extends Model<InferAttributes<Session>, InferCreationAttributes<Session, { omit: 'userId' }>>
  implements SessionAttributes
{
  declare id: CreationOptional<number>;
  declare token: string;
  declare userId: number;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    userId: DataTypes.INTEGER
  },
  {
    timestamps: true,
    sequelize: db.sequelize,
    tableName: 'sessions'
    // paranoid: true, // soft delete
  }
);

export default Session;
