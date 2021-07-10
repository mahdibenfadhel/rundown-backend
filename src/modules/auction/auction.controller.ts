import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuctionPayload } from './auction.payload';
import { FileInterceptor, MulterModule } from '@nestjs/platform-express';

@Controller('auction')
@ApiTags('auction')
export class AuctionController {
  constructor(private auctionService: AuctionService){}

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Post()
  @ApiResponse({ status: 201, description: 'created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createAuction: AuctionPayload): Promise<any> {
    const auction = await this.auctionService.create(createAuction);
    return {success: true, data: auction};
  }

  // @ApiBearerAuth()
  // @UseGuards(AuthGuard())
  @Post('/file')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'success' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createFromFile(@UploadedFile() file: Express.Multer.File): Promise<any> {
    MulterModule.register({
      dest: './upload',
    });
    const auction = await this.auctionService.createFromFile(file);
    return {success: true, data: 'added ' + auction + ' new auctions'};
  }


  @Get()
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getComments(@Request() request): Promise<any> {
    return this.auctionService.findAll();
  }

  @Delete()
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async delete(@Request() request): Promise<any> {
    return this.auctionService.deleteAll(request);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Put(':auctionId')
  @ApiParam({ name: 'auctionId' })
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateDoctor(@Param('auctionId') auctionId, @Body() updatedAuction: AuctionPayload): Promise<any> {
    return await this.auctionService.updateAuction(updatedAuction, auctionId);

  }

}
