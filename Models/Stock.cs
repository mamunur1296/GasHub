using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GasHub.Models
{
    public class Stock : BaseModel
    {
        [Required(ErrorMessage = "Product Name is Required")]
        [DisplayName("Product Name")]
        public Guid ProductId { get; set; }
        [Required(ErrorMessage = "Trader Name is Required")]
        [DisplayName("Trader Name")]
        public Guid TraderId { get; set; }
        [Required(ErrorMessage = "Quantity Name is Required")]
        [DisplayName("Quantity")]
        public int Quantity { get; set; }
        [DisplayName("Qc")]
        public bool IsQC { get; set; }
        [DisplayName("Status")]
        public bool IsActive { get; set; }

        // Navigation properties
        public virtual Product? Product { get; set; }
        public virtual Trader? Trader { get; set; }
    }
}
