// src/modules/carts/dto/create-cart.dto.ts

import { IsString, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCartItemDto } from './create-cart-item.dto';

export class CreateCartDto {
  @IsString()
  uid_session: string;

  @ValidateNested({ each: true })
  @Type(() => CreateCartItemDto)
  @ArrayMinSize(1)
  items: CreateCartItemDto[];
}
