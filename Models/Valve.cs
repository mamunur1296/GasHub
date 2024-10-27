using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace GasHub.Models
{
    public class Valve : BaseModel
    {
        [Required(ErrorMessage = "Valve Name is Required")]
        [DisplayName("Valve Name")]
        public string? Name { get; set; }
        [DisplayName("Unit")]
        public string? Unit { get; set; }
        [DisplayName("Status")]
        public bool IsActive { get; set; }
    }
}
