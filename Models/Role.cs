using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace GasHub.Models
{
    public class Role : BaseModel
    {
        [Required(ErrorMessage ="Role Name is Required")]
        [DisplayName("Role")]
        public string RoleName { get; set; }
    }

    public enum UserRole
    {
        Admin,
        User,
        Moderator
    }
}
