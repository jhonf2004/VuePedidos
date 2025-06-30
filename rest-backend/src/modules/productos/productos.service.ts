import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductoDto, UpdateProductoDto } from './dto';

@Injectable()
export class ProductosService {
  constructor(private prisma: PrismaService) {}

  // productos.service.ts
  async findByTipoCarta(tipoCarta: number) {
    return this.prisma.producto.findMany({
      where: {
        estado: true,
        categoria: {
          tipo_carta: tipoCarta,
        },
      },
      include: {
        categoria: true,
      },
      orderBy: {
        nombre: 'asc',
      },
    });
  }

  async findByTipo(tipo: number) {
    return this.prisma.producto.findMany({
      where: {
        estado: true,
        categoria: {
          is: {
            tipo_carta: tipo,
          },
        },
      },
      include: {
        categoria: {
          select: {
            id: true,
            nombre: true,
            tipo_carta: true,
          },
        },
      },
      orderBy: {
        nombre: 'asc',
      },
    });
  }


  // GET /api/productos - Obtener todos los productos
  async findAll() {
    return this.prisma.producto.findMany({
      where: { estado: true },
      include: {
        categoria: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
      orderBy: {
        nombre: 'asc',
      },
    });
  }

  // GET /api/productos/categoria/:categoria - Obtener por categoría
  async findByCategoria(categoriaId: number) {
    return this.prisma.producto.findMany({
      where: {
        categoriaId: categoriaId,
        estado: true,
      },
      include: {
        categoria: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
      orderBy: {
        nombre: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const producto = await this.prisma.producto.findUnique({
      where: { id },
      include: {
        categoria: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return producto;
  }

  // POST /api/productos - Crear producto
  async create(createProductoDto: CreateProductoDto) {
    return this.prisma.producto.create({
      data: createProductoDto,
      include: {
        categoria: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) {
    const producto = await this.prisma.producto.findUnique({
      where: { id },
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return this.prisma.producto.update({
      where: { id },
      data: updateProductoDto,
      include: {
        categoria: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    const producto = await this.prisma.producto.findUnique({
      where: { id },
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    // Soft delete - cambiar estado a false en lugar de eliminar
    return this.prisma.producto.update({
      where: { id },
      data: { estado: false },
    });
  }
}