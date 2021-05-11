import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Unique } from 'modules/common';
import { SameAs } from 'modules/common/validator/same-as.validator';
import { User } from 'modules/user';

export class AuctionPayload {

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  auction_cutoff: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  currency: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  rate_mid: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  rate_start: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  rate_end: string;

}
