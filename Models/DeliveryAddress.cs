using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace GasHub.Models
{
    public class DeliveryAddress : BaseModel
    {
        [Required(ErrorMessage ="mast select User ")]
        [DisplayName("User Name")]
        public Guid UserId { get; set; }
        [DisplayName("Address")]
        public string? Address { get; set; }
        [DisplayName("Phone")]
        public string? Phone { get; set; }
        [DisplayName("Mobile")]
        public string? Mobile { get; set; }
        [DisplayName("Status")]
        public bool? IsActive { get; set; }
        [DisplayName("Deactivated Date")]
        public DateTime? DeactivatedDate { get; set; }
        [DisplayName("Deactive")]
        public string? DeactiveBy { get; set; }
        [DisplayName("Default")]
        public bool? IsDefault { get; set; }
    }
}
