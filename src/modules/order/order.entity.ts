import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn, OneToOne, JoinColumn,
} from 'typeorm';
import { User } from '../user';
import { Auction } from '../auction/auction.entity';

@Entity({
  name: 'auction',
})
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  rate: string;

  @Column({ length: 255 })
  direction: string;

  @Column({ length: 255 })
  volume: string;

  @Column({ length: 255 })
  unit: string;

 @Column()
 modified_by: number;

  @UpdateDateColumn()
  last_modified!: Date;


  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => Auction)
  @JoinColumn()
  auction: Auction;
}

export class OrderFillableFields {
  rate: string;
  direction: string;
  volume: string;
  unit: string;
  last_modified: string;
  modified_by: number;
}
