// src/modules/categorias/categorias.module.ts
import { Module } from '@nestjs/common';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [CategoriasController],
  providers: [CategoriasService, PrismaService],
  exports: [CategoriasService],
})
export class CategoriasModule {}