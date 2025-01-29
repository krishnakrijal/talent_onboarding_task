using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using talent_onboarding.Server.Dtos;
using talent_onboarding.Server.Mappers;
using talent_onboarding.Server.Models;
namespace talent_onboarding.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly IndustyConnectWeek2Context _context;

        public CustomerController(IndustyConnectWeek2Context context)
        {
            _context = context;
        }

        // GET: api/Customer
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerDto>>> GetCustomers()
        {

            try
            {
                var customers = await _context.Customers.Select(s => CustomerMapper.EntityToDto(s)).ToListAsync();

                if (customers.Count > 0)
                {
                    return Ok(customers);
                }
                else
                {
                    return BadRequest("There are no customers at the moment");
                }
            }
            catch (Exception ex)
            {
                // You can log the exception here if necessary
                return StatusCode(500, "An error occurred while fetching customers: " + ex.Message);
            }


        }
        // GET: api/Customer/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> GetCustomer(int id)
        {
            // Verify that the id has a valid value (assuming it should be a positive integer)
            if (id <= 0)
            {
                return BadRequest("Invalid customer ID.");
            }

            try
            {
                var customer = await _context.Customers.FindAsync(id);

                if (customer == null)
                {
                    return NotFound();
                }

                var customerDto = CustomerMapper.EntityToDto(customer);

                return Ok(customerDto);
            }
            catch (Exception ex)
            {
                // You can log the exception here if necessary
                return StatusCode(500, "An error occurred while fetching the customer: " + ex.Message);
            }
        }


        // PUT: api/Customer/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomer(int id, CustomerDto customer)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid customer ID.");
            }

            if (id != customer.Id)
            {
                return BadRequest("Customer ID mismatch.");
            }


            // Map DTO to Entity
            var entity = CustomerMapper.DtoToEntity(customer);

            // Attach the entity to the context and mark it as modified
            _context.Entry(entity).State = EntityState.Modified;

            try
            {
                // Save changes to the database
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound("Customer not found");

            }
            catch (Exception ex)
            {
                // Log any other exceptions
                Console.WriteLine($"Error updating customer: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }

            // Return the updated customer as a DTO
            return Ok(CustomerMapper.EntityToDto(entity));
        }


        // POST: api/Customer
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Customer>> PostCustomer(Customer customer)
        {
            try
            {
                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetCustomer", new { id = customer.Id }, customer);
            }
            catch (Exception ex)
            {
                // Optionally, log the exception here
                return StatusCode(500, "An error occurred while saving the customer: " + ex.Message);
            }
        }


        // DELETE: api/Customer/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {

            if (id <= 0)
            {
                return BadRequest("Invalid customer ID.");
            }

            try
            {
               

                var customer = await _context.Customers.FindAsync(id);
                if (customer == null)
                {
                    
                    return NotFound("Customer not found");
                }

                
                _context.Customers.Remove(customer);
                await _context.SaveChangesAsync();

                
                return Ok($"Customer with ID {id} deleted successfully.");
            }
            catch (DbUpdateException ex)
            {
                
                return StatusCode(500, $"Database error: {ex.Message}");
            }
            catch (Exception ex)
            {
               
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

    }
}