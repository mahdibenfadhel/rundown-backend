import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn, OneToOne, JoinColumn, ManyToOne,
} from 'typeorm';
import { User } from '../user';
import { Auction } from '../auction/auction.entity';

@Entity({
  name: 'order',
})
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  rate: string;

  @Column({ length: 255 })
  direction: string;

  @Column()
  hasAlarm: boolean;

  @Column({default: false})
  isFromAdmin: boolean;

  @Column({ length: 255 })
  volume: string;


 @Column()
 modified_by: number;

  @UpdateDateColumn()
  last_modified!: Date;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Auction, auction => auction.orders, {
    eager: true
  })
  auction: Auction;

  @ManyToOne(() => User, user => user.orders)
  user: User;
}

export class OrderFillableFields {
  rate: string;
  direction: string;
  volume: string;
  unit: string;
  last_modified: string;
  modified_by: number;
}
