import { TipoPedido, EstadoPedido } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class CreatePedidoFromCartDto {
  @IsString()
  cartId: string;

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
  @IsEnum(EstadoPedido)
  estado?: EstadoPedido;

  @IsOptional()
  @IsString()
  notas?: string;
}