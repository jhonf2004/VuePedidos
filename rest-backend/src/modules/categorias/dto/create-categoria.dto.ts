import { IsString, IsOptional, MaxLength, IsInt } from 'class-validator';

export class CreateCategoriaDto {
  @IsString()
  @MaxLength(100)
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  iconoUrl?: string;

  @IsInt()
  tipo_carta: number;
}