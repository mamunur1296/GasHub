using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace GasHub.Models
{
    public class ProductSize : BaseModel
    {
        [Required(ErrorMessage = "Size is  Required ")]
        [DisplayName("Size")]
        public decimal Size { get; set; }

        [Required(ErrorMessage = "Unit is  Required ")]
        [DisplayName("Unit")]
        public string? Unit { get; set; }
        [DisplayName("Status")]
        public bool IsActive { get; set; }
    }
}
