using Servicio.Models.General;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BussinesLogic.Admin.Services
{
    public interface ITypeService
    {
        public Task<ONDType> CreateAsync(ONDType newBook);

        public Task<ONDType?> GetAsync(string id);

        public Task UpdateAsync(string id, ONDType updatedBook);

        public Task RemoveAsync(string id);
    }
}
