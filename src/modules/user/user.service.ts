import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User, UserFillableFields } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async get(id: number) {
    return this.userRepository.findOne(id);
  }
 async findAll() {
    return this.userRepository.find();
  }
 async sinceLastWeek() {
    const users = await this.userRepository.find();
    const usersSinceLastWeek = [];
   const d = new Date();
   d.setDate(d.getDate() - 7);
   const lastWeek = d.getDate();
    users.forEach(u => {
      if (u.created_at.getDate() > lastWeek){
        usersSinceLastWeek.push(u)
      }
    })
   return (usersSinceLastWeek.length / users.length) * 100
  }

  async getByEmail(email: string) {
    return await this.userRepository
      .createQueryBuilder('users')
      .where('users.email = :email')
      .setParameter('email', email)
      .getOne();
  }

  async create(payload: UserFillableFields) {
    const user = await this.getByEmail(payload.email);

    if (user) {
      throw new NotAcceptableException(
        'User with provided email already created.',
      );
    }

    return await this.userRepository.save(this.userRepository.create(payload));
  }
}
