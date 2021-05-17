import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn, OneToMany,
} from 'typeorm';
import { Order } from '../order/order.entity';

@Entity({
  name: 'auction',
})
export class Auction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  auction_cutoff: string;

  @Column({ length: 255 })
  currency: string;

  @Column({ length: 255 })
  rate_mid: string;

  @Column({ type: 'date' })
  rate_start: string;

  @Column({ type: 'date' })
  rate_end: string;

  @OneToMany(() => Order, order => order.auction)
  orders: Order[];
}

export class ActionFillableFields {
  auction_cutoff: string;
  currency: string;
  rate_mid: string;
  rate_start: string;
  rate_end: string;
}
