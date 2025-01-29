using talent_onboarding.Server.Dtos;
using talent_onboarding.Server.Models;

namespace talent_onboarding.Server.Mappers
{
    public static class SaleMapper
    {
        public static SaleDto EntityToDto(Sale sale)
        {
            return new SaleDto
            {
                Id = sale.Id,
                CustomerId = sale.CustomerId, // If nullable, use `?? 0` or keep it nullable in DTO.
                ProductId = sale.ProductId,
                StoreId = sale.StoreId,
                DateSold = sale.DateSold.ToDateTime(TimeOnly.MinValue), // Convert DateOnly to DateTime
                CustomerName = sale.Customer?.Name,
                ProductName = sale.Product?.Name,
                StoreName = sale.Store?.Name
            };
        }

        public static Sale DtoToEntity(SaleDto saleDto)
        {
            return new Sale
            {
                Id = saleDto.Id,
                CustomerId = saleDto.CustomerId ?? 0, // If Sale.CustomerId is not nullable, provide default
                ProductId = saleDto.ProductId ?? 0,
                StoreId = saleDto.StoreId ?? 0,
                DateSold = saleDto.DateSold.HasValue
                    ? DateOnly.FromDateTime(saleDto.DateSold.Value) // Convert DateTime? to DateOnly
                    : default // Default `DateOnly` is 0001-01-01
            };
        }
    }

}    

