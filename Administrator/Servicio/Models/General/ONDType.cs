using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace Servicio.Models.General
{
    public class ONDType
    {
        #region Miembros
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string TableCode { get; set; }
        public int TypeCode { get; set; }
        public string Description1 { get; set; }
        public string Description2 { get; set; }
        [BsonRepresentation(BsonType.ObjectId)]
        public string CreationUser { get; set; }
        public DateTime? CreationDate { get; set; }
        public string ModificationUser { get; set; }
        public DateTime? ModificationDate { get; set; }
        #endregion

        #region Constructor
        public ONDType() { }
        #endregion
    }
}
