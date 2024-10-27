using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GasHub.Models
{
    public class Order : BaseModel
    {

        [Required(ErrorMessage = "User Name is  Required ")]
        [DisplayName("User Name")]
        public Guid UserId { get; set; }
        [Required(ErrorMessage = "Product Name is  Required ")]
        [DisplayName("Product Name")]
        public Guid ProductId { get; set; }

        [DisplayName("Hold")]
        public bool IsHold { get; set; }
        [DisplayName("Cancel")]
        public bool IsCancel { get; set; }
        [DisplayName("Return Product")]
        public Guid ReturnProductId { get; set; }
        [DisplayName("Placed")]
        public bool IsPlaced { get; set; }
        [DisplayName("Confirmed")]
        public bool IsConfirmed { get; set; }
        public string TransactionNumber { get; set; }
        public string Comments { get; set; }
        [DisplayName("Dispatched")]
        public bool IsDispatched { get; set; }
        public bool IsReadyToDispatch { get; set; }
        [DisplayName("Delivered")]
        public bool IsDelivered { get; set; }

        // Navigation properties
        public virtual User User { get; set; }
        public virtual Product Product { get; set; }

    }
}
