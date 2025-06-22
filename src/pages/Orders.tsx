
import Navbar from '@/components/Navbar';
import NewOrderModal from '@/components/NewOrderModal';
import OrderCard from '@/components/OrderCard';
import OrderStats from '@/components/OrderStats';
import { useOrders } from '@/contexts/OrderContext';

export default function Orders() {
  const { orders, updateOrderStatus, addOrder } = useOrders();

  const handleOrderCreated = (newOrder: any) => {
    addOrder(newOrder);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Gerenciar Pedidos</h2>
          <NewOrderModal onOrderCreated={handleOrderCreated} ordersCount={orders.length} />
        </div>

        <OrderStats />

        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onUpdateStatus={updateOrderStatus} 
            />
          ))}
        </div>
      </main>
    </div>
  );
}
