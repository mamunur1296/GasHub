namespace GasHub.Dtos
{
    public class ConfirmOrderDTOs
    {
        public string UserID {  get; set; }
        public Dictionary<string, int> ProductIdAndQuentity { get; set; }
    }
}
