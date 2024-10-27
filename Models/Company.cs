using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace GasHub.Models
{
    public class Company : BaseModel
    {
        [Required(ErrorMessage = "Company Name is Required")]
        [DisplayName("Company Name")]
        public string? Name { get; set; }
        [DisplayName("Contact Person")]
        public string? Contactperson { get; set; }
        [DisplayName("Phone(Personal)")]
        public string? ContactPerNum { get; set; }
        [DisplayName("Phone(Office)")]
        public string? ContactNumber { get; set; }
        [DisplayName("Status")]
        public bool? IsActive { get; set; }
        [DisplayName("Deactivated Date")]
        public DateTime? DeactivatedDate { get; set; }
        public string? DeactiveBy { get; set; }
        [DisplayName("BIN")]
        public string? BIN { get; set; }
        // Navigation properties
        public virtual ICollection<Product>? Products { get; set; }
        public virtual ICollection<Trader>? Traders { get; set; }
    }
}
