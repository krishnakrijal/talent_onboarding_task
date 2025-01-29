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
        private readonly IndustyConnectWeek2Context _context;

        public ProductController(IndustyConnectWeek2Context context)
        {
            _context = context;
        }

        // GET: api/Product
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts()
        {
            try
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
            catch (Exception ex)
            {
                // Optionally, log the exception here
                return StatusCode(500, "An error occurred while fetching products: " + ex.Message);
            }
        }

        // GET: api/Product/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            // Verify that the id has a valid value (assuming it should be a positive integer)
            if (id <= 0)
            {
                return BadRequest("Invalid product ID.");
            }

            try
            {
                var product = await _context.Products.FindAsync(id);

                if (product == null)
                {
                    return NotFound();
                }

                var productDto = ProductMapper.EntityToDto(product);

                return Ok(productDto);
            }
            catch (Exception ex)
            {
                // Optionally, log the exception here
                return StatusCode(500, "An error occurred while fetching the product: " + ex.Message);
            }
        }


        // PUT: api/Product/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, ProductDto product)
        {
            // Verify that the id has a valid value (assuming it should be a positive integer)
            if (id <= 0)
            {
                return BadRequest("Invalid product ID.");
            }
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
            try
            {
                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetProduct", new { id = product.Id }, product);
            }
            catch (Exception ex)
            {
                // Optionally, log the exception here
                return StatusCode(500, "An error occurred while saving the product: " + ex.Message);
            }
        }



        // DELETE: api/Product/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Invalid product ID.");
            }
            try
            {

                var product = await _context.Products.FindAsync(id);
                if (product == null)
                {
                   
                    return NotFound("Product not found");
                }

                
                _context.Products.Remove(product);
                await _context.SaveChangesAsync();

                
                return Ok($"Product with ID {id} deleted successfully.");
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