// src/modules/carts/dto/create-cart-item.dto.ts

import { IsString, IsNumber, IsOptional, IsInt, Min } from 'class-validator';

export class CreateCartItemDto {
  @IsString()
  itemId: string;

  @IsString()
  itemType: string;

  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsOptional()
  @IsString()
  image?: string;
}
