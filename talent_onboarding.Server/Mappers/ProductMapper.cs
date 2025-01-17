using talent_onboarding.Server.Dtos;
using talent_onboarding.Server.Models;

namespace talent_onboarding.Server.Mappers
{
    public class ProductMapper
    {
        public static Product DtoToEntity(ProductDto productDto)
        {
            var productEntity = new Product
            {
                Id = productDto.Id,
                Name = productDto.Name,
                Price = productDto.Price,
            };

            return productEntity;
        }

        public static ProductDto EntityToDto(Product product)
        {
            var productDto = new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
            };

            return productDto;

        }
    }
}
