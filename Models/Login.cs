using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace GasHub.Models
{
    public class Login
    {
        [Required(ErrorMessage = "User Name is  Required ")]
        [DisplayName("User Name")]
        public string UserName { get; set; }
        [Required(ErrorMessage = "Password is  Required ")]
        [DisplayName("Password")]
        public string Password { get; set; }
    }
}
