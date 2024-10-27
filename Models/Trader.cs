using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace GasHub.Models
{
    public class Trader : BaseModel
    {
        [Required(ErrorMessage = "Company Name is Required")]
        [DisplayName("Company Name")]
        public Guid CompanyId { get; set; }
        [Required(ErrorMessage = "Trader Name is Required")]
        [DisplayName("Trader Name")]
        public string? Name { get; set; }
        [DisplayName("Contact Person")]
        public string? Contactperson { get; set; }
        [DisplayName("Phone(Personal)")]
        public string? ContactPerNum { get; set; }
        [DisplayName("Phone(Office) ")]
        public string? ContactNumber { get; set; }
        [DisplayName("Active")]
        public bool? IsActive { get; set; }
        public DateTime? DeactivatedDate { get; set; }
        public string? DeactiveBy { get; set; }
        [DisplayName("BIN")]
        public string? BIN { get; set; }

        // Navigation properties
        public virtual ICollection<Stock>? Stocks { get; set; }
    }
}
