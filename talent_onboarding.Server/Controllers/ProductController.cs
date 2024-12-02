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
    public class ProductController : ControllerBase
    {
        private readonly IndustryConnectWeek2Context _context;

        public ProductController(IndustryConnectWeek2Context context)
        {
            _context = context;
        }

        // GET: api/Product
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
        {

            var products = await _context.Products.Select(s => ProductMapper.EntityToDto(s)).ToListAsync();

            if (products.Count > 0)
            {
                return Ok(products);
            }
            else
            {
                return BadRequest("There are no products at the moment");
            }

        }
        // GET: api/Product/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            var productDto = ProductMapper.EntityToDto(product);

            return Ok(productDto);
        }

        // PUT: api/Product/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, ProductDto product)
        {
            if (id != product.Id)
            {
                return BadRequest("Product ID mismatch");
            }

            // Map DTO to Entity
            var entity = ProductMapper.DtoToEntity(product);

            // Attach the entity to the context and mark it as modified
            _context.Entry(entity).State = EntityState.Modified;

            try
            {
                // Save changes to the database
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound("Product not found");

            }
            catch (Exception ex)
            {
                // Log any other exceptions
                Console.WriteLine($"Error updating product: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }

            // Return the updated customer as a DTO
            return Ok(ProductMapper.EntityToDto(entity));
        }


        // POST: api/Product
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProduct", new { id = product.Id }, product);
        }


        // DELETE: api/Product/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                Console.WriteLine($"[INFO] Received DELETE request for ID: {id}");

                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                    Console.WriteLine($"[INFO] Product with ID {id} not found.");
                    return NotFound("Product not found");
                }

                Console.WriteLine($"[INFO] Deleting customer: ID={product.Id}, Name={product.Name}");
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();

                Console.WriteLine($"[INFO] Product with ID {id} deleted successfully.");
                return Ok($"Product with ID {id} deleted successfully.");
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