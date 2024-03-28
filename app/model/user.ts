import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { ROLE } from '../utils/enum';

@Table({
  timestamps: false,
  tableName: 'User',
})
export class User extends Model<User> {
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
    name!: string;

  @Column({
    type: DataType.STRING(50),
    unique: true,
    allowNull: false,
  })
    email_id!: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
    password!: string;

  @Column({
    type: DataType.STRING(15),
    unique: true,
    allowNull: false,
  })
    phone_no!: string;

  @Column({
    type: DataType.ENUM(ROLE.ADMIN, ROLE.MANAGER, ROLE.MECHANIC, ROLE.CUSTOMER),
    allowNull: false,
  })
    role!: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
    profile_image!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'created_at',
  })
    created_at!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
    field: 'updated_at',
  })
    updated_at!: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    field: 'is_active',
  })
    is_active!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    field: 'is_deleted',
  })
    is_deleted!: boolean;
}
