
import { useState } from 'react';
import { Order } from '@/types';
import NewOrderModal from '@/components/NewOrderModal';
import OrderCard from '@/components/OrderCard';
import OrderStats from '@/components/OrderStats';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      tenantId: 'tenant-1',
      customerId: '1',
      items: [
        {
          productId: '1',
          productName: 'Pizza Margherita',
          quantity: 1,
          unitPrice: 35.90,
          total: 35.90,
        },
        {
          productId: '3',
          productName: 'Coca-Cola 2L',
          quantity: 2,
          unitPrice: 8.90,
          total: 17.80,
        },
      ],
      total: 58.70,
      status: 'preparing',
      paymentMethod: 'PIX',
      deliveryAddress: 'Rua das Flores, 123',
      deliveryFee: 5.00,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      tenantId: 'tenant-1',
      customerId: '2',
      items: [
        {
          productId: '2',
          productName: 'Pizza Pepperoni',
          quantity: 2,
          unitPrice: 42.90,
          total: 85.80,
        },
      ],
      total: 90.80,
      status: 'out_for_delivery',
      paymentMethod: 'Cartão de Crédito',
      deliveryAddress: 'Av. Principal, 456',
      deliveryFee: 5.00,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ]);

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleOrderCreated = (newOrder: Order) => {
    setOrders([newOrder, ...orders]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-orange-600">📋 Gerenciar Pedidos</h1>
            <NewOrderModal onOrderCreated={handleOrderCreated} ordersCount={orders.length} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
