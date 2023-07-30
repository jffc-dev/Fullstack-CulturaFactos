using Microsoft.AspNetCore.Mvc;
using Servicio.Models.General;
using Servicio.Services;

namespace Servicio.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TypesController : ControllerBase
    {
        private readonly TypesService _typesService;

        public TypesController(TypesService typesService) =>
            _typesService = typesService;

        [HttpGet]
        public async Task<List<ONDType>> Get() =>
            await _typesService.GetAsync();

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<ONDType>> Get(string id)
        {
            var type = await _typesService.GetAsync(id);

            if (type is null)
            {
                return NotFound();
            }

            return type;
        }

        [HttpPost]
        public async Task<IActionResult> Post(ONDType newType)
        {
            await _typesService.CreateAsync(newType);

            return CreatedAtAction(nameof(Get), new { id = newType.Id }, newType);
        }

        [HttpPut("{id:length(24)}")]
        public async Task<IActionResult> Update(string id, ONDType updatedBook)
        {
            var type = await _typesService.GetAsync(id);

            if (type is null)
            {
                return NotFound();
            }

            updatedBook.Id = type.Id;

            await _typesService.UpdateAsync(id, updatedBook);

            return NoContent();
        }

        [HttpDelete("{id:length(24)}")]
        public async Task<IActionResult> Delete(string id)
        {
            var type = await _typesService.GetAsync(id);

            if (type is null)
            {
                return NotFound();
            }

            await _typesService.RemoveAsync(id);

            return NoContent();
        }
    }
}
