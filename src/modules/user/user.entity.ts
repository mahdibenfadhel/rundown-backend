import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn, OneToMany,
} from 'typeorm';
import { PasswordTransformer } from './password.transformer';
import { Order } from '../order/order.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  company: string;

  @Column({ length: 255 })
  gui_version: string;

  @Column({ length: 255 })
  last_action: string;

  @Column({ length: 255 })
  email: string;

  @Column({
    name: 'password',
    length: 255,
    transformer: new PasswordTransformer(),
  })
  password: string;

  toJSON() {
    const { password, ...self } = this;
    return self;
  }
  @OneToMany(() => Order, order => order.user)
  orders: Order[];
}

export class UserFillableFields {
  name: string;
  company: string;
  email: string;
  gui_version: string;
  last_action: string;
  password: string;
}
