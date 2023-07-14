namespace Servicio.Models.General
{
    public class ONDType
    {
        #region Miembros
        public string TableCode { get; set; }
        public string TypeCode { get; set; }
        public string Description1 { get; set; }
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
