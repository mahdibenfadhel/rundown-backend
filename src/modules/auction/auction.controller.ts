import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Request } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuctionPayload } from './auction.payload';

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

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Post('/file')
  @ApiResponse({ status: 201, description: 'created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createFromFile(@Body() createAuction: AuctionPayload): Promise<any> {
    const auction = await this.auctionService.createFromFile(createAuction);
    return {success: true, data: auction};
  }


  @Get()
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getComments(@Request() request): Promise<any> {
    return this.auctionService.findAll();
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
