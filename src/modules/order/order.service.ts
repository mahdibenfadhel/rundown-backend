import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auction } from '../auction/auction.entity';
import { getConnection, Repository } from 'typeorm';
import { AuctionPayload } from '../auction/auction.payload';
import { Order } from './order.entity';
import { orderPayload } from './order.payload';
import { User } from '../user';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async get(id: string) {
    return this.orderRepository.findOne(id);
  }

  async create(payload: orderPayload, auctionId, user) {
    const order: Order = new Order();
    const auction = await getConnection()
      .createQueryBuilder()
      .select("auction")
      .from(Auction, "auction")
      .where("auction.id = :id", { id: auctionId })
      .getOne();

    order.rate = payload.rate
    order.direction = payload.direction
    order.volume = payload.volume
    order.unit = payload.unit
    order.modified_by = payload.modified_by
    order.auction = auction
    order.user = user
    return await this.orderRepository.save(this.orderRepository.create(payload));
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find();
  }


  async updateOrder(updateOrder: orderPayload, id) {
    const order = await this.get(id);

    if (!order) {
      throw new NotAcceptableException(
        'no such order',
      );
    }
    await this.orderRepository.update(id, updateOrder);
    const orderUpdated = await this.get(id);
    return { success: true, user: orderUpdated };
  }

  async deleteOrder(id) {
    const order = await this.get(id);

    if (!order) {
      throw new NotAcceptableException(
        'no such order',
      );
    }
    await this.orderRepository.delete(id);
    return { success: true };
  }
  async deleteOrdersFromUser(user) {
    const entities = await this.orderRepository.find({user: user});
    await this.orderRepository.remove(entities);
    return { success: true };
  }
}
