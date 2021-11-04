import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, getRepository, Repository } from 'typeorm';
import { Auction } from './auction.entity';
import { AuctionPayload } from './auction.payload';
import * as fs from 'fs';
import { Order } from '../order/order.entity';
import { orderPayload } from '../order/order.payload';
import { User } from '../user';

@Injectable()
export class AuctionService {
  constructor(
    @InjectRepository(Auction)
    private readonly auctionRepository: Repository<Auction>,
  ) {}

  async get(id: string) {
    return this.auctionRepository.findOne(id);
  }
  async deleteOne(id: string) {
    return this.auctionRepository.delete(id);
  }
  async deleteAll(rq) {
    return getConnection()
      .createQueryBuilder()
      .select("order")
      .from(Order, "order")
      .leftJoinAndSelect("user", "user")
      .where("user.id = :id", { id: rq.id })
      .delete();
  }

  async create(payload: AuctionPayload) {

    return await this.auctionRepository.save(this.auctionRepository.create(payload));
  }
 async createFromFile(file) {
    let auctions: AuctionPayload[] = [];
   fs.writeFile('./auction.csv', file.buffer, function (err) {
     if (err)  throw new NotAcceptableException(
       'file error',
     );
   });
   const csv=require('csvtojson')
   await csv()
     .fromFile('./auction.csv')
     .then((jsonObj)=>{
       auctions = jsonObj;
       auctions.forEach(a => {
         let auction: AuctionPayload = {
           auction_cutoff: new Date(a['auction_cutoff']),
           bank_name: a['Bank name'],
           currency: a.currency,
           rate_mid: a.rate_mid,
           rate_start: new Date(a['rate_start']).toDateString(),
           rate_end: new Date(a['rate_end']).toDateString(),
           cleared: a.cleared,
           fix: a.fix,
           fromAdmin: false,
         }
         this.create(auction)
       })
     })
    return auctions.length;
  }
 async createFromOrderFile(file, userId) {
   let user = await getRepository(User)
     .createQueryBuilder("user")
     .where("user.id = :id", { id: userId })
     .getOne();
    let auctions = [];
   fs.writeFile('./orders.csv', file.buffer, function (err) {
     if (err)  throw new NotAcceptableException(
       'file error',
     );
   });
   const csv=require('csvtojson')
   await csv()
     .fromFile('./orders.csv')
     .then((jsonObj)=>{
       auctions = jsonObj;
       auctions.forEach(async a => {
         let order = new Order();
         order.rate= a.Strike;
           order.direction= a.Direction.toLowerCase();
           order.hasAlarm= false;
           order.isFromAdmin= true;
           order.volume= '0';
           order.modified_by= 0;
           order.notional= a.Notional;
           order.dv01= a.dv01;
           order.user= user;
         let auction_cutoff= new Date(a['End date']);
         auction_cutoff.setHours((a['Auction time']).split(':')[0]);
         auction_cutoff.setMinutes((a['Auction time']).split(':')[1]);
         auction_cutoff.setSeconds((a['Auction time']).split(':')[2]);
           let auction: AuctionPayload = {
           auction_cutoff,
             bank_name: a['Bank name'],
              currency: a.Currency,
           rate_mid: a.Strike,
           rate_start: new Date(a['Effective date']).toDateString(),
           rate_end: new Date(a['End date']).toDateString(),
           cleared: a['Clearing house'],
           fix: a.Fix,
           fromAdmin: true,
         }
         let savedAuc = await this.auctionRepository.save(this.auctionRepository.create(auction))
         let savedOrder =  await getConnection()
           .createQueryBuilder()
           .insert()
           .into(Order)
           .values(order)
           .execute();
         await getConnection()
           .createQueryBuilder()
           .update(Order)
           .set({ auction: savedAuc})
           .where("id = :id", { id: savedOrder.identifiers[0].id })
           .execute();
       })
     })
    return auctions.length;
  }

  async findAll(): Promise<Auction[]> {
    return this.auctionRepository.find();
  }


  async updateAuction(updateAuction: AuctionPayload, id) {
    const auction = await this.get(id);

    if (!auction) {
      throw new NotAcceptableException(
        'no such auction',
      );
    }
    await this.auctionRepository.update(id, updateAuction);
    const auctionUpdated = await this.get(id);
    return { success: true, user: auctionUpdated };
  }

  async deleteAuction(id) {
    const auction = await this.get(id);

    if (!auction) {
      throw new NotAcceptableException(
        'no such auction',
      );
    }
    await this.auctionRepository.delete(id);
    return { success: true };
  }
}
