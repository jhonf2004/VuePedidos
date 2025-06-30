import { Body, Controller, Get, Post, Param, Patch, Delete } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  // GET /api/carts/:sessionId - Obtener carrito
  @Get(':sessionId')
  findOne(@Param('sessionId') sessionId: string) {
    return this.cartsService.findOne(sessionId);
  }

  // NUEVO: POST /api/carts - Crear o actualizar carrito COMPLETO
  @Post()
  async createOrUpdateCart(@Body() createCartDto: CreateCartDto) {
    const cart = await this.cartsService.createOrUpdateCart(
      createCartDto.uid_session,
      createCartDto.items,
    );
    return {
      message: 'Carrito creado o actualizado correctamente',
      data: cart,
    };
  }

  // POST /api/carts/:sessionId - Crear solo session vacía
  @Post(':sessionId')
  async createOrGet(@Param('sessionId') sessionId: string) {
    const cart = await this.cartsService.createOrGet(sessionId);
    return {
      message: 'Carrito obtenido o creado exitosamente',
      data: cart,
    };
  }

  // POST /api/carts/:sessionId/items - Agregar item individual
  @Post(':sessionId/items')
  async addItem(@Param('sessionId') sessionId: string, @Body() body: any) {
    const item = await this.cartsService.addItem(sessionId, body);
    return {
      message: 'Item agregado al carrito exitosamente',
      data: item,
    };
  }

  // PATCH /api/carts/items/:itemId - Actualizar cantidad de item
  @Patch('items/:itemId')
  async updateItem(@Param('itemId') itemId: string, @Body('quantity') quantity: number) {
    const updated = await this.cartsService.updateItem(itemId, quantity);
    return {
      message: 'Cantidad de item actualizada',
      data: updated,
    };
  }

  // DELETE /api/carts/items/:itemId - Eliminar item
  @Delete('items/:itemId')
  async removeItem(@Param('itemId') itemId: string) {
    await this.cartsService.removeItem(itemId);
    return {
      message: 'Item eliminado del carrito',
    };
  }

  // DELETE /api/carts/:sessionId/clear - Vaciar carrito
  @Delete(':sessionId/clear')
  async clearCart(@Param('sessionId') sessionId: string) {
    await this.cartsService.clearCart(sessionId);
    return {
      message: 'Carrito vaciado exitosamente',
    };
  }
}
