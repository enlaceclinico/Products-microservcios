
import { Type } from 'class-transformer';
import { IsOptional, IsInt, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsOptional() // Este parámetro es opcional
  @Type(()=>Number)

  @IsPositive() // Debe ser un número positivo
  page?: number = 1; // Valor por defecto: 1

  @IsOptional() // Este parámetro es opcional
  @Type(()=>Number)
  @IsPositive() // Debe ser un número positivo
  limit?: number = 10; // Valor por defecto: 10
}
