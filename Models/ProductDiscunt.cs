using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace GasHub.Models
{
    public class ProductDiscunt : BaseModel
    {
        [Required(ErrorMessage = "Product Name is  Required ")]
        [DisplayName("Product Name")]
        public Guid ProductId { get; set; }
        [DisplayName("discount Amount")]
        public decimal DiscountedPrice { get; set; }
        [DisplayName("Status")]
        public bool IsActive { get; set; }
        [DisplayName("Valid Till")]
        public DateTime ValidTill { get; set; }
        public Product? Product { get; set; }
    }
}
