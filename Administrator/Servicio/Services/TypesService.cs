using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Servicio.Models;
using Servicio.Models.General;

namespace Servicio.Services
{
    public class TypesService
    {
        private readonly IMongoCollection<ONDType> _typesCollection;
        private readonly string _collectionName = "type";

        public TypesService(
            IOptions<CulturaFactosDataBaseSettings> bookStoreDatabaseSettings)
        {
            var mongoClient = new MongoClient(
                bookStoreDatabaseSettings.Value.ConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(
                bookStoreDatabaseSettings.Value.DatabaseName);

            _typesCollection = mongoDatabase.GetCollection<ONDType>(this._collectionName);
        }

        public async Task<List<ONDType>> GetAsync() =>
            await _typesCollection.Find(_ => true).ToListAsync();

        public async Task<ONDType?> GetAsync(string id) =>
            await _typesCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(ONDType newBook) =>
            await _typesCollection.InsertOneAsync(newBook);

        public async Task UpdateAsync(string id, ONDType updatedBook) =>
            await _typesCollection.ReplaceOneAsync(x => x.Id == id, updatedBook);

        public async Task RemoveAsync(string id) =>
            await _typesCollection.DeleteOneAsync(x => x.Id == id);
    }
}
