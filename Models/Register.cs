using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace GasHub.Models
{
    public class Register  : BaseModel
    {
        [Required(ErrorMessage = "First Name is Required")]
        [DisplayName("First Name")]
        public string FirstName { get; set; }
        [Required(ErrorMessage = "Last Name is Required")]
        [DisplayName("Last Name")]
        public string LaststName { get; set; }
        [Required(ErrorMessage = "User Name is Required")]
        [DisplayName("User Name")]
        public string UserName { get; set; }
        [Required(ErrorMessage = "Email is Required")]
        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        [RegularExpression(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", ErrorMessage = "Invalid Email Format")]
        [DisplayName("Email")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Phone Number is Required")]
        [RegularExpression(@"^(?:\+88|88)?(01[3-9]\d{8})$", ErrorMessage = "Invalid  Phone Number . Must be 11 digits.")]
        [DisplayName("Phone")]
        public string PhoneNumber { get; set; }
        [Required(ErrorMessage = "Password is Required")]
        [DisplayName("Password")]
        public string Password { get; set; }
        public Guid? TraderId { get; set; }
        [Required(ErrorMessage = "Confirm Password is Required")]
        
        public string ConfirmationPassword { get; set; }
        public List<string> Roles { get; set; }
    }
    
}
