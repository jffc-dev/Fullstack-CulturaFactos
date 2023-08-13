namespace Servicio.Models
{
    public class League
    {
        #region Miembros
        public int Id { get; set; }
        public string Link { get; set; }
        public string Shortname { get; set; }
        public string Fullname { get; set; }
        public string Image { get; set; }
        #endregion

        #region Constructor
        public League() { }
        #endregion
    }
}
