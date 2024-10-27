using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace GasHub.Models
{
    public class Retailer : BaseModel
    {
        [Required(ErrorMessage = "Retailer Name is Required")]
        [DisplayName("Retailer Name")]
        public string? Name { get; set; }
        [Required(ErrorMessage = "Contact Person is Required")]
        [DisplayName("Contact Person")]
        public string? Contactperson { get; set; }
        [DisplayName("Phone(Personal)")]
        public string? ContactPerNum { get; set; }
        [DisplayName("Phone(Office)")]
        public string? ContactNumber { get; set; }
        [DisplayName("Status")]
        public bool? IsActive { get; set; }
        public DateTime? DeactivatedDate { get; set; }
        public string? DeactiveBy { get; set; }
        [DisplayName("BIN")]
        public string? BIN { get; set; }
    }
}
