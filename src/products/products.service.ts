import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination-response';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);     

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Base de datos conectada'); // Mensaje de conexión
    } catch (error) {
      this.logger.error('Error al conectar a la base de datos:', error);
    }
  }

  async create(createProductDto: CreateProductDto) {
    try {
      const product = await this.product.create({
        data: {
          name: createProductDto.name,
          price: createProductDto.price,
        },
      });
      return product; // Retorna el producto creado
    } catch (error) {
      this.logger.error("Error al crear el producto:", error);
      throw error; // Puedes lanzar un error para manejarlo en un interceptor o controlador
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginationResponseDto<any>> {
    const { page, limit } = paginationDto;
  
    try {
      const products = await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where:{available:true}
      });
  
      const totalCount = await this.product.count({where:{available:true}});
  
      return new PaginationResponseDto(products, totalCount, page, limit);
    } catch (error) {
      this.logger.error('Error al obtener los productos:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const product = await this.product.findUnique({
        where: { id,available:true },
      });
  
      if (!product) {
        throw new NotFoundException(`El producto con id ${id} no fue encontrado`);
      }
  
      return product;
    } catch (error) {
      this.logger.error(`Error al obtener el producto con id ${id}:`, error);
      throw error;
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const {id:__, ...data} = updateProductDto
      // Verifica si el producto existe antes de intentar actualizarlo
      const existingProduct = await this.product.findUnique({
        where: { id,
                 
         },
      });
  
      if (!existingProduct) {
        throw new NotFoundException(`El producto con id ${id} no fue encontrado`);
      }
  
      // Si existe, procede a actualizarlo
      return await this.product.update({
        where: { id },
        data: data,
      });
    } catch (error) {
      this.logger.error(`Error al actualizar el producto con id ${id}:`, error);
      throw error;
    }
  }

/*  async remove(id: number) {
    try {
      return await this.product.delete({
        where: { id },
      }); // Elimina un producto específico
    } catch (error) {
      this.logger.error(`Error al eliminar el producto con id ${id}:`, error);
      throw error;
    }
  }
*/

  async remove(id: number) {
    try {
      // Verifica si el producto existe
      const existingProduct = await this.product.findUnique({
        where: { id },
      });
  
      if (!existingProduct) {
        throw new NotFoundException(`El producto con id ${id} no fue encontrado`);
      }
  
      // Actualiza el campo `available` a `false` en lugar de eliminar el producto
      return await this.product.update({
        where: { id },
        data: { available: false },
      });
    } catch (error) {
      this.logger.error(`Error al eliminar (desactivar) el producto con id ${id}:`, error);
      throw error;
    }
  }
}
