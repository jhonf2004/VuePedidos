// pedidos.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto, CreatePedidoFromCartDto, UpdatePedidoDto, UpdateEstadoPedidoDto } from './dto';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  // Crear pedido desde carrito (método principal)
  @Post('from-cart')
  async createFromCart(@Body() createPedidoFromCartDto: CreatePedidoFromCartDto) {
    const { cartId, ...pedidoData } = createPedidoFromCartDto;

    const pedido = await this.pedidosService.createFromCart(cartId, pedidoData);

    if (!pedido) {
      throw new BadRequestException('No se pudo crear el pedido.');
    }

    return {
      message: 'Pedido creado exitosamente',
      id: pedido.id,
      estado: pedido.estado,
    };
  }



}