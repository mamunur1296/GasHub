using Newtonsoft.Json.Linq;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GasHub.Models
{
    public class Product : BaseModel
    {
        [Required(ErrorMessage = "Company Name is  Required ")]
        [DisplayName("Company Name")]
        public Guid CompanyId { get; set; }
        [Required(ErrorMessage = "Product Name is  Required ")]
        [DisplayName("Product Name")]
        public string? Name { get; set; }
        [Required(ErrorMessage = "Product Size is  Required ")]
        [DisplayName("Product Size")]
        public Guid ProdSizeId { get; set; }
        [Required(ErrorMessage = "Product Valve is  Required ")]
        [DisplayName("Product Valve")]
        public Guid ProdValveId { get; set; }
        [DisplayName("Image")]
        public string? ProdImage { get; set; }
        [DisplayName("Price")]
        public int ProdPrice { get; set; }
        [DisplayName("Discount")]
        public decimal ? DiscountPrice { get; set; }
        public DateTime ValidTill { get; set; }
        [DisplayName("Image")]
        public IFormFile ? FormFile { get; set; }
        [DisplayName("Status")]
        public bool IsActive { get; set; }

        // Navigation properties
        public virtual Company Company { get; set; }
        public virtual ProductSize Size { get; set; }
        public virtual Valve Valve { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
        public virtual ICollection<ProdReturn> Returns { get; set; }
    }
}
