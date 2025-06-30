import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { TipoPedido, EstadoPedido } from '@prisma/client';

export class CreatePedidoDto {
  @IsString()
  nombreCliente: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  mesa?: string;

  @IsEnum(TipoPedido)
  tipo: TipoPedido;

  @IsOptional()
  fechaPedido?: Date;

  @IsOptional()
  @IsEnum(EstadoPedido)
  estado?: EstadoPedido;

  @IsOptional()
  @IsNumber()
  total?: number; // Opcional porque se calcula desde el carrito

  @IsOptional()
  @IsString()
  notas?: string;
}