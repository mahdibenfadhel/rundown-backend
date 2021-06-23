import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Unique } from 'modules/common';
import { SameAs } from 'modules/common/validator/same-as.validator';
import { User } from 'modules/user';

export class orderPayload {

  @ApiProperty({
    required: false,
  })
  @IsNotEmpty()
  rate: string;

  @ApiProperty({
    required: false,
  })
  @IsNotEmpty()
  direction: string;

  @ApiProperty({
    required: false,
  })
  @IsNotEmpty()
  volume: string;

  @ApiProperty({
    required: false,
  })
  @IsNotEmpty()
  unit: string;
 @ApiProperty({
    required: false,
  })
  @IsNotEmpty()
 hasAlarm: boolean;

  @ApiProperty({
    required: false,
  })
  @IsNotEmpty()
  modified_by: number;

}
