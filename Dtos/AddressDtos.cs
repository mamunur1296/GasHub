using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace GasHub.Dtos
{
    public class AddressDtos
    {
        [Required]
        public Guid UserId { get; set; }
        [Required(ErrorMessage = "Phone Number is Required")]
        [RegularExpression(@"^(?:\+88|88)?(01[3-9]\d{8})$", ErrorMessage = "Invalid  Phone Number . Must be 11 digits.")]
        [DisplayName("Phone")]
        public string ContactNumber { get; set; }
         [Required]
        [DisplayName("District")]
        public string District { get; set; }

        [Required]
        [DisplayName("Street Address")]
        public string StreetAddress { get; set; }
        
    }
}
