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
            try
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
            catch (Exception ex)
            {
                // Optionally, log the exception here
                return StatusCode(500, "An error occurred while fetching sales: " + ex.Message);
            }
        }


        // GET: api/Sale/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SaleDto>> GetSale(int id)
        {
            // Verify that the id has a valid value (assuming it should be a positive integer)
            if (id <= 0)
            {
                return BadRequest("Invalid sale ID.");
            }

            try
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
            catch (Exception ex)
            {
                // Optionally, log the exception here
                return StatusCode(500, "An error occurred while fetching the sale: " + ex.Message);
            }
        }


        // PUT: api/Sale/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSale(int id, SaleDto saleDto)
        {
            // Verify that the id has a valid value (assuming it should be a positive integer)
            if (id <= 0)
            {
                return BadRequest("Invalid sale ID.");
            }
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
                
                return StatusCode(500, "Internal server error.");
            }

            return Ok(SaleMapper.EntityToDto(entity));
        }

        // POST: api/Sale
        [HttpPost]
        public async Task<ActionResult<SaleDto>> PostSale(SaleDto saleDto)
        {
            try
            {
                var sale = SaleMapper.DtoToEntity(saleDto);

                _context.Sales.Add(sale);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetSale), new { id = sale.Id }, SaleMapper.EntityToDto(sale));
            }
            catch (Exception ex)
            {
                // Optionally, log the exception here
                return StatusCode(500, "An error occurred while saving the sale: " + ex.Message);
            }
        }


        // DELETE: api/Sale/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSale(int id)
        {

            // Verify that the id has a valid value (assuming it should be a positive integer)
            if (id <= 0)
            {
                return BadRequest("Invalid sale ID.");
            }
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
                return StatusCode(500, $"Database error: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
    }
}