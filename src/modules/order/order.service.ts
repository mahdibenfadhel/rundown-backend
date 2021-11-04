import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auction } from '../auction/auction.entity';
import { getConnection, In, Repository } from 'typeorm';
import { Order } from './order.entity';
import { orderPayload } from './order.payload';
import { AuctionService } from '../auction/auction.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>) {}

  async get(id: string) {
    return this.orderRepository.findOne(id);
  }

  async create(payload: orderPayload, auctionId, user) {
    const order: Order = new Order();
    const auction: Auction = await getConnection()
      .getRepository(Auction)
      .createQueryBuilder("auction")
      .where("auction.id = :id", { id: auctionId })
      .getOne();
    order.rate = payload.rate
    order.direction = payload.direction
    order.volume = payload.volume
    order.hasAlarm = payload.hasAlarm
    order.modified_by = payload.modified_by
    order.notional = payload.notional
    order.dv01 = payload.dv01
    order.auction = auction
    order.user = user
    return await this.orderRepository.save(this.orderRepository.create(order));
  }

  async findAll(user): Promise<Order[]> {
    return this.orderRepository.find({ where: { user: user.id } });
  }
  async getOrdersById(userId): Promise<Order[]> {
    return this.orderRepository.find({ where: { user: userId } });
  }
async findAllOrders(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['user']});
  }
  async findAllOrdersSinceYesterday() {
    const users = await this.orderRepository.find();
    const usersSinceLastWeek = [];
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const lastWeek = d.getDate();
    users.forEach(u => {
      if (u.created_at.getDate() > lastWeek){
        usersSinceLastWeek.push(u)
      }
    })
    return (usersSinceLastWeek.length / users.length) * 100
  }
  async getAllOrdersChart() {
    const currencies = [0, 0, 0, 0, 0, 0];
    const orders = await this.orderRepository.find({ relations: ['auction']});
    orders.forEach(u => {
      console.log(u.auction.currency)
      switch (u.auction.currency){
        case 'MPC':
          currencies[0]++
          break;
        case 'ECB':
          currencies[1]++
          break;
        case 'FOMC':
          currencies[2]++
          break;
        case 'RBA':
          currencies[3]++
          break;
        case 'BOC':
          currencies[4]++
          break;
        case 'RBNZ':
          currencies[5]++
          break;
      }
    })
return currencies;
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
    const ids = [];
    const entities =  await getConnection()
      .createQueryBuilder()
      .select("order")
      .from(Order, "order")
      .where("order.userId = :id", { id: user.id })
      .getMany();
    console.log(entities)
    entities.forEach(e => {
      ids.push(e.id)
    })
    console.log(ids)
    if (ids) {
      console.log(ids)
      await this.orderRepository.delete({ id: In(ids) });
    }    // await this.orderRepository.remove(entities);
    return { success: true };
  }

  async deleteOrdersById(id) {
   return this.orderRepository.delete(id)
  }
  async deleteAlarmFromUser(user) {
    const ids = [];
    const entities =  await getConnection()
      .createQueryBuilder()
      .select("order")
      .from(Order, "order")
      .where("order.userId = :id", { id: user.id })
      .getMany();
    entities.forEach(e => {
      console.log(e)
      if (e.hasAlarm) {
        ids.push(e.id);
      }    })
      await this.orderRepository.delete({ id: In(ids) });
    // await this.orderRepository.remove(entities);
    return { success: true };
  }
}
