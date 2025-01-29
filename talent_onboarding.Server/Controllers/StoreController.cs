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
            try
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
            catch (Exception ex)
            {
                // Optionally, log the exception here
                return StatusCode(500, "An error occurred while fetching stores: " + ex.Message);
            }
        }


        // GET: api/Store/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StoreDto>> GetStore(int id)
        {
            // Verify that the id has a valid value (assuming it should be a positive integer)
            if (id <= 0)
            {
                return BadRequest("Invalid store ID.");
            }

            try
            {
                var store = await _context.Stores.FindAsync(id);

                if (store == null)
                {
                    return NotFound("Store not found.");
                }

                var storeDto = StoreMapper.EntityToDto(store);

                return Ok(storeDto);
            }
            catch (Exception ex)
            {
                // Optionally, log the exception here
                return StatusCode(500, "An error occurred while fetching the store: " + ex.Message);
            }
        }


        // PUT: api/Store/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStore(int id, StoreDto storeDto)
        {
            // Verify that the id has a valid value (assuming it should be a positive integer)
            if (id <= 0)
            {
                return BadRequest("Invalid store ID.");
            }
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
                
                return StatusCode(500, "Internal server error.");
            }

            return Ok(StoreMapper.EntityToDto(entity));
        }

        // POST: api/Store
        [HttpPost]
        public async Task<ActionResult<StoreDto>> PostStore(StoreDto storeDto)
        {
            try
            {
                var store = StoreMapper.DtoToEntity(storeDto);

                _context.Stores.Add(store);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetStore), new { id = store.Id }, StoreMapper.EntityToDto(store));
            }
            catch (Exception ex)
            {
                // Optionally, log the exception here
                return StatusCode(500, "An error occurred while saving the store: " + ex.Message);
            }
        }

        // DELETE: api/Store/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStore(int id)
        {
            // Verify that the id has a valid value (assuming it should be a positive integer)
            if (id <= 0)
            {
                return BadRequest("Invalid store ID.");
            }
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
                
                return StatusCode(500, $"Database error: {ex.Message}");
            }
            catch (Exception ex)
            {
               
                return StatusCode(500, $"Internal Server Error: {ex.Message}");
            }
        }
    }
}