import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  timestamps: false,
  tableName: 'Otp',
})
export class Otp extends Model<Otp> {
  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
    email_id!: string;

  @Column({
    type: DataType.STRING(6),
    allowNull: false,
  })
    otp!: string;

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
}
