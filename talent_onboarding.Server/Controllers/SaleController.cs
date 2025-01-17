using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using talent_onboarding.Server.Dtos;
using talent_onboarding.Server.Mappers;
using talent_onboarding.Server.Models;

namespace talent_onboarding.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SaleController : ControllerBase
    {
        private readonly IndustyConnectWeek2Context _context;

        public SaleController(IndustyConnectWeek2Context context)
        {
            _context = context;
        }

        // GET: api/Sale
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SaleDto>>> GetSales()
        {
            var sales = await _context.Sales
                .Include(s => s.Customer)
                .Include(s => s.Product)
                .Include(s => s.Store)
                .Select(s => SaleMapper.EntityToDto(s))
                .ToListAsync();

            if (sales.Count > 0)
            {
                return Ok(sales);
            }
            else
            {
                return NotFound("There are no sales at the moment.");
            }
        }

        // GET: api/Sale/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SaleDto>> GetSale(int id)
        {
            var sale = await _context.Sales
                .Include(s => s.Customer)
                .Include(s => s.Product)
                .Include(s => s.Store)
                .FirstOrDefaultAsync(s => s.Id == id);

            if (sale == null)
            {
                return NotFound("Sale not found.");
            }

            var saleDto = SaleMapper.EntityToDto(sale);

            return Ok(saleDto);
        }

        // PUT: api/Sale/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSale(int id, SaleDto saleDto)
        {
            if (id != saleDto.Id)
            {
                return BadRequest("Sale ID mismatch.");
            }

            var entity = SaleMapper.DtoToEntity(saleDto);

            _context.Entry(entity).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound("Sale not found.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating sale: {ex.Message}");
                return StatusCode(500, "Internal server error.");
            }

            return Ok(SaleMapper.EntityToDto(entity));
        }

        // POST: api/Sale
        [HttpPost]
        public async Task<ActionResult<SaleDto>> PostSale(SaleDto saleDto)
        {
            var sale = SaleMapper.DtoToEntity(saleDto);

            _context.Sales.Add(sale);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSale), new { id = sale.Id }, SaleMapper.EntityToDto(sale));
        }

        // DELETE: api/Sale/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSale(int id)
        {
            try
            {
                var sale = await _context.Sales.FindAsync(id);
                if (sale == null)
                {
                    return NotFound("Sale not found.");
                }

                _context.Sales.Remove(sale);
                await _context.SaveChangesAsync();

                return Ok($"Sale with ID {id} deleted successfully.");
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine($"Database error during deletion: {ex.Message}");
                return StatusCode(500, $"Database error: {ex.Message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Unexpected error: {ex.Message}");
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
    }
}