import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto, UpdateProductoDto } from './dto';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  // POST /api/productos - Crear producto
  @Post()
  async create(@Body() createProductoDto: CreateProductoDto) {
    const producto = await this.productosService.create(createProductoDto);
    return {
      id: producto.id,
      message: 'Producto creado exitosamente',
      data: producto,
    };
  }

  // GET /api/productos/tipo/:tipo
  @Get('tipo/:tipo')
  findByTipo(@Param('tipo', ParseIntPipe) tipo: number) {
    return this.productosService.findByTipo(tipo);
  }
  @Get('tipo-carta/:tipoCarta')
  findByTipoCarta(@Param('tipoCarta', ParseIntPipe) tipoCarta: number) {
    return this.productosService.findByTipoCarta(tipoCarta);
  }
  // GET /api/productos - Obtener todos los productos
  @Get()
  findAll() {
    return this.productosService.findAll();
  }

  // GET /api/productos/categoria/:categoria - Obtener por categoría
  @Get('categoria/:categoria')
  findByCategoria(@Param('categoria', ParseIntPipe) categoria: number) {
    return this.productosService.findByCategoria(categoria);
  }

  // GET /api/productos/:id - Obtener producto específico
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.findOne(id);
  }

  // PATCH /api/productos/:id - Actualizar producto
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.productosService.update(id, updateProductoDto);
  }

  // DELETE /api/productos/:id - Eliminar producto (soft delete)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.remove(id);
  }
}