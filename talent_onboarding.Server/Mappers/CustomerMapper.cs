using talent_onboarding.Server.Models;
using talent_onboarding.Server.Dtos;

namespace talent_onboarding.Server.Mappers
{
    public class CustomerMapper
    {
            public static Customer DtoToEntity(CustomerDto customerDto)
            {
                var customerEntity = new Customer
                {
                    Id = customerDto.Id,
                    Name = customerDto.Name,
                    Address = customerDto.Address,
                };

                return customerEntity;
            }

            public static CustomerDto EntityToDto(Customer customer)
            {
                var customerDto = new CustomerDto
                {
                    Id = customer.Id,
                    Name = customer.Name,
                    Address = customer.Address,
                };

                return customerDto;

            }
        }


    


}
