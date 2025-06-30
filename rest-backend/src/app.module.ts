import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { CategoriasModule } from './modules/categorias/categorias.module';
import { ProductosModule } from './modules/productos/productos.module';
import { CartsModule } from './modules/carts/carts.module';
import { PedidosModule } from './modules/pedidos/pedidos.module'; 

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables de entorno estén disponibles globalmente
    }),
    CategoriasModule,
    ProductosModule,
    CartsModule,
    PedidosModule,
    // Aquí agregaremos otros módulos conforme los migremos
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}