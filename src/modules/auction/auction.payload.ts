import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Unique } from 'modules/common';
import { SameAs } from 'modules/common/validator/same-as.validator';
import { User } from 'modules/user';

export class AuctionPayload {

  @ApiProperty({
    required: false,
  })
  @IsNotEmpty()
  auction_cutoff: Date;

  @ApiProperty({
    required: false,
  })
  @IsNotEmpty()
  currency: string;

  @ApiProperty({
    required: false,
  })
  @IsNotEmpty()
  rate_mid: string;

  @ApiProperty({
    required: false,
    nullable: true,
  })
  bank_name: string;

  @ApiProperty({
    required: false,
  })
  @IsNotEmpty()
  rate_start: string;

  @ApiProperty({
    required: false,
  })
  @IsNotEmpty()
  rate_end: string;

  @ApiProperty({
    required: false,
  })
  @IsNotEmpty()
  cleared: string;
  @ApiProperty({
    required: false,
  })
  @IsNotEmpty()
  fix: string;

  @ApiProperty({
    required: true,
    default: false,
  })
  @IsNotEmpty()
  fromAdmin: boolean;
}
