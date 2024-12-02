using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
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
        private readonly IndustryConnectWeek2Context _context;

        public CustomerController(IndustryConnectWeek2Context context)
        {
            _context = context;
        }

        // GET: api/Customer
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerDto>>> GetCustomers()
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
        // GET: api/Customer/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> GetCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);

            if (customer == null)
            {
                return NotFound();
            }

            var customerDto = CustomerMapper.EntityToDto(customer);

            return Ok(customerDto);
        }

        // PUT: api/Customer/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCustomer(int id, CustomerDto customer)
        {
            if (id != customer.Id)
            {
                return BadRequest("Customer ID mismatch");
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
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCustomer", new { id = customer.Id }, customer);
        }


        // DELETE: api/Customer/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            try
            {
                Console.WriteLine($"[INFO] Received DELETE request for ID: {id}");

                var customer = await _context.Customers.FindAsync(id);
                if (customer == null)
                {
                    Console.WriteLine($"[INFO] Customer with ID {id} not found.");
                    return NotFound("Customer not found");
                }

                Console.WriteLine($"[INFO] Deleting customer: ID={customer.Id}, Name={customer.Name}");
                _context.Customers.Remove(customer);
                await _context.SaveChangesAsync();

                Console.WriteLine($"[INFO] Customer with ID {id} deleted successfully.");
                return Ok($"Customer with ID {id} deleted successfully.");
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine($"[ERROR] Database error during deletion: {ex.Message}");
                return StatusCode(500, $"Database error: {ex.Message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Unexpected error: {ex.Message}");
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }

    }
}