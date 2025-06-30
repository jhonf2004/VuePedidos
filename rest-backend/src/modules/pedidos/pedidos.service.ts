import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePedidoDto, UpdatePedidoDto } from './dto';
import { EstadoPedido } from '@prisma/client';

@Injectable()
export class PedidosService {
  constructor(private prisma: PrismaService) {}

  // Crear pedido desde un carrito
  async createFromCart(cartId: string, pedidoData: Omit<CreatePedidoDto, 'total'>) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Obtener el carrito con sus items
      const cart = await tx.cart.findUnique({
        where: { id: cartId },
        include: {
          items: true
        }
      });

      if (!cart || !cart.items.length) {
        throw new BadRequestException('Carrito no encontrado o vacío');
      }

      // 2. Calcular el total del carrito
      const total = cart.items.reduce((sum, item) => {
        return sum + (Number(item.price) * item.quantity);
      }, 0);

      // 3. Crear el pedido
      const pedido = await tx.pedido.create({
        data: {
          nombreCliente: pedidoData.nombreCliente,
          telefono: pedidoData.telefono,
          direccion: pedidoData.direccion,
          mesa: pedidoData.mesa,
          tipo: pedidoData.tipo,
          estado: pedidoData.estado || EstadoPedido.pendiente,
          total: total,
          notas: pedidoData.notas,
          cartId: cartId, // Mantener referencia al carrito original
        }
      });

      // 4. Crear los detalles del pedido desde los items del carrito
      const detallesPedido = cart.items.map(item => ({
        pedidoId: pedido.id,
        productoId: parseInt(item.itemId), // itemId es el productoId
        cantidad: item.quantity,
        precioUnitario: item.price
      }));
      console.log('➡️ carrito:', cart);
      console.log('➡️ detallesPedido:', detallesPedido);

      await tx.detallePedido.createMany({
        data: detallesPedido
      });

      // 5. Opcional: Limpiar el carrito después de crear el pedido
      await tx.cartItem.deleteMany({
        where: { cartId: cartId }
      });

      // 6. Retornar el pedido completo
      return tx.pedido.findUnique({
        where: { id: pedido.id },
        include: {
          detallePedidos: {
            include: {
              producto: true
            }
          },
          cart: {
            include: {
              items: true
            }
          }
        }
      });
    });
  }

  // // Crear pedido manual (sin carrito)
  // async create(createPedidoDto: CreatePedidoDto) {
  //   try {
  //     const pedido = await this.prisma.pedido.create({
  //       data: {
  //         nombreCliente: createPedidoDto.nombreCliente,
  //         telefono: createPedidoDto.telefono,
  //         direccion: createPedidoDto.direccion,
  //         mesa: createPedidoDto.mesa,
  //         tipo: createPedidoDto.tipo,
  //         fechaPedido: createPedidoDto.fechaPedido ? new Date(createPedidoDto.fechaPedido) : new Date(),
  //         estado: createPedidoDto.estado || EstadoPedido.pendiente,
  //         total: createPedidoDto.total,
  //         notas: createPedidoDto.notas,
  //       },
  //       include: {
  //         detallePedidos: {
  //           include: {
  //             producto: true
  //           }
  //         }
  //       }
  //     });

  //     return pedido;
  //   } catch (error) {
  //     throw new Error(`Error al crear pedido: ${error.message}`);
  //   }
  // }

  async findAll() {
    return this.prisma.pedido.findMany({
      include: {
        detallePedidos: {
          include: {
            producto: true
          }
        },
        cart: {
          include: {
            items: true
          }
        }
      },
      orderBy: {
        fechaPedido: 'desc'
      }
    });
  }

  async findOne(id: number) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: {
        detallePedidos: {
          include: {
            producto: true
          }
        },
        cart: {
          include: {
            items: true
          }
        }
      }
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }

    return pedido;
  }

  async findByCartId(cartId: string) {
    return this.prisma.pedido.findMany({
      where: { cartId },
      include: {
        detallePedidos: {
          include: {
            producto: true
          }
        }
      },
      orderBy: {
        fechaPedido: 'desc'
      }
    });
  }

  async update(id: number, updatePedidoDto: UpdatePedidoDto) {
    const pedidoExistente = await this.findOne(id);
    
    return this.prisma.pedido.update({
      where: { id },
      data: {
        ...updatePedidoDto,
        fechaPedido: updatePedidoDto.fechaPedido ? new Date(updatePedidoDto.fechaPedido) : pedidoExistente.fechaPedido,
      },
      include: {
        detallePedidos: {
          include: {
            producto: true
          }
        }
      }
    });
  }

  async remove(id: number) {
    const pedidoExistente = await this.findOne(id);
    
    return this.prisma.pedido.delete({
      where: { id }
    });
  }

  async updateEstado(id: number, estado: EstadoPedido) {
    const pedidoExistente = await this.findOne(id);
    
    return this.prisma.pedido.update({
      where: { id },
      data: { estado },
      include: {
        detallePedidos: {
          include: {
            producto: true
          }
        }
      }
    });
  }

  async findByEstado(estado: EstadoPedido) {
    return this.prisma.pedido.findMany({
      where: { estado },
      include: {
        detallePedidos: {
          include: {
            producto: true
          }
        }
      },
      orderBy: {
        fechaPedido: 'desc'
      }
    });
  }

  // Método auxiliar para recalcular el total del pedido
  async recalculateTotal(pedidoId: number): Promise<number> {
    const detalles = await this.prisma.detallePedido.findMany({
      where: { pedidoId }
    });

    const total = detalles.reduce((sum, detalle) => {
      return sum + (Number(detalle.cantidad) * Number(detalle.precioUnitario));
    }, 0);

    // Actualizar el total en el pedido
    await this.prisma.pedido.update({
      where: { id: pedidoId },
      data: { total }
    });

    return total;
  }

  // Obtener estadísticas de pedidos
  async getStats() {
    const [total, pendientes, enProceso, servidos, cancelados] = await Promise.all([
      this.prisma.pedido.count(),
      this.prisma.pedido.count({ where: { estado: EstadoPedido.pendiente } }),
      this.prisma.pedido.count({ where: { estado: EstadoPedido.en_proceso } }),
      this.prisma.pedido.count({ where: { estado: EstadoPedido.servido } }),
      this.prisma.pedido.count({ where: { estado: EstadoPedido.cancelado } })
    ]);

    return {
      total,
      pendientes,
      enProceso,
      servidos,
      cancelados
    };
  }
}