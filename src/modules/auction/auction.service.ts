import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auction } from './auction.entity';
import { AuctionPayload } from './auction.payload';

@Injectable()
export class AuctionService {
  constructor(
    @InjectRepository(Auction)
    private readonly auctionRepository: Repository<Auction>,
  ) {}

  async get(id: string) {
    return this.auctionRepository.findOne(id);
  }

  async create(payload: AuctionPayload) {

    return await this.auctionRepository.save(this.auctionRepository.create(payload));
  }
 async createFromFile(payload: AuctionPayload) {

    return await this.auctionRepository.save(this.auctionRepository.create(payload));
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
