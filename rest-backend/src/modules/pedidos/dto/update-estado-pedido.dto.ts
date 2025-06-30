import { EstadoPedido } from "@prisma/client";
import { IsEnum } from "class-validator";

export class UpdateEstadoPedidoDto {
  @IsEnum(EstadoPedido)
  estado: EstadoPedido;
}