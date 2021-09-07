import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';


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
  volume: string;

 @ApiProperty({
    required: false,
  })
  @IsNotEmpty()
 hasAlarm: boolean;

  @ApiProperty({
    required: true,
    default: false,
  })
  @IsNotEmpty()
  isFromAdmin: boolean;

  @ApiProperty({
    required: false,
  })
  modified_by: number;

}
