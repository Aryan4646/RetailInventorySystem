using RetailMartBackend.Models;

namespace RetailMartBackend.Interfaces
{
    public interface IOrderRepository
    {
        Order CreateOrder(Order order);
        Order GetOrderByID(int orderID);

    }
}