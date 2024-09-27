export class PaginationResponseDto<T> {
    data: T[]; // Los datos paginados
    total: number; // Total de elementos
    page: number; // Página actual
    totalPages: number; // Total de páginas
    lastPage: number; // Última página
  
    constructor(data: T[], total: number, page: number, limit: number) {
      this.data = data;
      this.total = total;
      this.page = page;
      this.totalPages = Math.ceil(total / limit);
      this.lastPage = this.totalPages; // La última página es igual al total de páginas
    }
  }