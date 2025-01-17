using talent_onboarding.Server.Dtos;
using talent_onboarding.Server.Models;

namespace talent_onboarding.Server.Mappers
{

    public static class StoreMapper
    {
        public static StoreDto EntityToDto(Store store)
        {
            return new StoreDto
            {
                Id = store.Id,
                Name = store.Name,
                Address = store.Address
            };
        }

        public static Store DtoToEntity(StoreDto storeDto)
        {
            return new Store
            {
                Id = storeDto.Id,
                Name = storeDto.Name,
                Address = storeDto.Address
            };
        }
    }
}
