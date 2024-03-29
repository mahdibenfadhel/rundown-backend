import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { OrderService } from './order.service';
import { orderPayload } from './order.payload';

@Controller('order')
@ApiTags('order')
export class OrderController {
  constructor(private orderService: OrderService){}

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Post(':auctionId')
  @ApiParam({ name: 'auctionId' })
  @ApiResponse({ status: 201, description: 'created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Request() request, @Param('auctionId') auctionId, @Body() createOrder: orderPayload): Promise<any> {
    const order = await this.orderService.create(createOrder, auctionId, request.user);
    return {success: true, data: order};
  }
 @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('getOrdersByUser/:userId')
  @ApiParam({ name: 'userId' })
  @ApiResponse({ status: 201, description: 'created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getOrderById(@Param('userId') userId): Promise<any> {
    return await this.orderService.getOrdersById(userId);

  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get()
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getComments(@Request() request): Promise<any> {
    const order = await this.orderService.findAll(request.user);
    return {success: true, data: order};
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('allOrders')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAllOrders(@Request() request): Promise<any> {
    const order = await this.orderService.findAllOrders();
    return {success: true, data: order};
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Delete('allOrderFromUser')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteOrdersFromUser(@Request() request): Promise<any> {
    return await this.orderService.deleteOrdersFromUser(request.user);

  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Delete('allAlarmFromUser')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteAlarmsFromUser(@Request() request): Promise<any> {
    return await this.orderService.deleteAlarmFromUser(request.user);

  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('allOrdersSinceYesterday')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAllOrdersSinceYesterday(@Request() request): Promise<any> {
    return  await this.orderService.findAllOrdersSinceYesterday();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Get('ordersChart')
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAllOrdersChart(@Request() request): Promise<any> {
    return  await this.orderService.getAllOrdersChart();
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Put(':orderId')
  @ApiParam({ name: 'orderId' })
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateDoctor(@Param('orderId') orderId, @Body() updatedOrder: orderPayload): Promise<any> {
    return await this.orderService.updateOrder(updatedOrder, orderId);

  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Delete(':orderId')
  @ApiParam({ name: 'orderId' })
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteOrders(@Param('orderId') orderId): Promise<any> {
    return await this.orderService.deleteOrdersById(orderId);

  }


  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @Delete(':orderId')
  @ApiParam({ name: 'orderId' })
  @ApiResponse({ status: 200, description: 'Successful Response' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteOrder(@Param('orderId') orderId): Promise<any> {
    return await this.orderService.deleteOrder(orderId);

  }

}
