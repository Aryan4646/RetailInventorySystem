using RetailMartBackend.Models;
using RetailMartBackend.Interfaces;
using RetailMartBackend.Exceptions;

namespace RetailMartBackend.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly ICustomerRepository _customerRepository;
        private readonly IProductRepository _productRepository;
        private readonly IInventoryRepository _inventoryRepository;

        public OrderService(
            IOrderRepository orderRepository,
            ICustomerRepository customerRepository,
            IProductRepository productRepository,
            IInventoryRepository inventoryRepository)
        {
            _orderRepository = orderRepository;
            _customerRepository = customerRepository;
            _productRepository = productRepository;
            _inventoryRepository = inventoryRepository;
        }

        public Order CreateOrder(Order order)
        {
            if (!_customerRepository.CustomerExists(order.CustomerID))
            {
                throw new NotFoundException("Customer not found.");
            }

            if (order.Quantity <= 0)
            {
                throw new Exception("Quantity must be greater than 0.");
            }

            var product = _productRepository.GetProductByID(order.ProductID);

            if (product == null)
            {
                throw new NotFoundException("Product not found.");
            }

            int availableStock = _inventoryRepository.GetAvailableStock(order.ProductID);

            if (availableStock < order.Quantity)
            {
                throw new OutOfStockException($"Only {availableStock} item(s) available in stock.");
            }

            order.TotalAmount = product.Price * order.Quantity;

            if (order.OrderDate == default)
            {
                order.OrderDate = DateTime.Now;
            }

            if (string.IsNullOrEmpty(order.LastStatus))
            {
                order.LastStatus = "Created";
            }

            Order createdOrder = _orderRepository.CreateOrder(order);

            _inventoryRepository.ReduceStock(order.ProductID, order.Quantity);

            return createdOrder;
        }

        public Order GetOrderByID(int orderID)
        {
            var order = _orderRepository.GetOrderByID(orderID);

            if (order == null)
            {
                throw new NotFoundException("Order not found.");
            }

            return order;
        }
    }
}