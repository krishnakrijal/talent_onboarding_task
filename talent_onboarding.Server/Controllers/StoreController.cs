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
    public class StoreController : ControllerBase
    {
        private readonly IndustyConnectWeek2Context _context;

        public StoreController(IndustyConnectWeek2Context context)
        {
            _context = context;
        }

        // GET: api/Store
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StoreDto>>> GetStores()
        {
            var stores = await _context.Stores.Select(s => StoreMapper.EntityToDto(s)).ToListAsync();

            if (stores.Count > 0)
            {
                return Ok(stores);
            }
            else
            {
                return BadRequest("There are no stores at the moment.");
            }
        }

        // GET: api/Store/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StoreDto>> GetStore(int id)
        {
            var store = await _context.Stores.FindAsync(id);

            if (store == null)
            {
                return NotFound("Store not found.");
            }

            var storeDto = StoreMapper.EntityToDto(store);

            return Ok(storeDto);
        }

        // PUT: api/Store/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStore(int id, StoreDto storeDto)
        {
            if (id != storeDto.Id)
            {
                return BadRequest("Store ID mismatch.");
            }

            var entity = StoreMapper.DtoToEntity(storeDto);

            _context.Entry(entity).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound("Store not found.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating store: {ex.Message}");
                return StatusCode(500, "Internal server error.");
            }

            return Ok(StoreMapper.EntityToDto(entity));
        }

        // POST: api/Store
        [HttpPost]
        public async Task<ActionResult<StoreDto>> PostStore(StoreDto storeDto)
        {
            var store = StoreMapper.DtoToEntity(storeDto);

            _context.Stores.Add(store);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetStore), new { id = store.Id }, StoreMapper.EntityToDto(store));
        }

        // DELETE: api/Store/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStore(int id)
        {
            try
            {
                var store = await _context.Stores.FindAsync(id);
                if (store == null)
                {
                    return NotFound("Store not found.");
                }

                _context.Stores.Remove(store);
                await _context.SaveChangesAsync();

                return Ok($"Store with ID {id} deleted successfully.");
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