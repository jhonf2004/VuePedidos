import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsPositive,
  MaxLength,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateProductoDto {
  @IsString()
  @MaxLength(100)
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  precio: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  imagenUrl?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  estado?: boolean = true;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  categoriaId?: number;
}