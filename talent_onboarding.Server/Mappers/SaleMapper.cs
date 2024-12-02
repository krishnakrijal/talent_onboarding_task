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
                CustomerId = sale.CustomerId,
                ProductId = sale.ProductId,
                StoreId = sale.StoreId,
                DateSold = sale.DateSold,
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
                CustomerId = saleDto.CustomerId,
                ProductId = saleDto.ProductId,
                StoreId = saleDto.StoreId,
                DateSold = saleDto.DateSold
            };
        }
    }
}
