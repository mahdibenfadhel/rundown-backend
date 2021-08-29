import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { UserModule } from '../user';
import { ConfigModule, ConfigService } from '../config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction } from '../auction/auction.entity';
import { Order } from './order.entity';
import { AuctionService } from '../auction/auction.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order]),
    UserModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET_KEY'),
          signOptions: {
            ...(configService.get('JWT_EXPIRATION_TIME')
              ? {
                expiresIn: Number(configService.get('JWT_EXPIRATION_TIME')),
              }
              : {}),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [OrderService,  JwtStrategy],
    exports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [OrderController]
})
export class OrderModule {}
