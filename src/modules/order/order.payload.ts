import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Unique } from 'modules/common';
import { SameAs } from 'modules/common/validator/same-as.validator';
import { User } from 'modules/user';

export class orderPayload {

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  rate: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  direction: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  volume: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  unit: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  modified_by: number;

}
