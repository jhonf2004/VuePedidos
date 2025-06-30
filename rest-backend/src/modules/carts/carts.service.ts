import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CartsService {
  constructor(private prisma: PrismaService) {}

  // Obtener carrito por sessionId
  async findOne(sessionId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { sessionId },
      include: { items: true },
    });

    if (!cart) {
      throw new NotFoundException(`Carrito con sessionId ${sessionId} no encontrado`);
    }

    return cart;
  }
  
  async createOrGet(sessionId: string) {
    return this.prisma.cart.upsert({
      where: { sessionId },
      create: { sessionId },
      update: {},
    });
  }


  /**
   * Crear carrito con múltiples items (o actualizar si existe)
   */
  async createOrUpdateCart(sessionId: string, items: Array<{
    itemId: string;
    itemType: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>) {
    // Crear o traer carrito
    const cart = await this.prisma.cart.upsert({
      where: { sessionId },
      create: { sessionId },
      update: {},
    });

    // Borrar items anteriores (opcional, para que no se acumulen)
    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // Insertar todos los items nuevos
    if (items.length > 0) {
      await this.prisma.cartItem.createMany({
        data: items.map(item => ({
          cartId: cart.id,
          itemId: item.itemId,
          itemType: item.itemType,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || null,
        })),
      });
    }

    // Devolver carrito actualizado
    return this.findOne(sessionId);
  }

  // Agregar un item individual (si sigues usando este endpoint)
  async addItem(sessionId: string, data: {
    itemId: string;
    itemType: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }) {
    const cart = await this.prisma.cart.upsert({
      where: { sessionId },
      create: { sessionId },
      update: {},
    });

    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        ...data,
      },
    });
  }

  async updateItem(itemId: string, quantity: number) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException(`Item con ID ${itemId} no encontrado`);
    }

    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  async removeItem(itemId: string) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException(`Item con ID ${itemId} no encontrado`);
    }

    return this.prisma.cartItem.delete({
      where: { id: itemId },
    });
  }

  async clearCart(sessionId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { sessionId },
    });

    if (!cart) {
      throw new NotFoundException(`Carrito con sessionId ${sessionId} no encontrado`);
    }

    return this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }
}
