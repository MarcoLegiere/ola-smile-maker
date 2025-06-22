
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Order, Customer } from '@/types';

interface OrderContextType {
  orders: Order[];
  customers: Customer[];
  setOrders: (orders: Order[]) => void;
  setCustomers: (customers: Customer[]) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customer: Customer) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
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
    {
      id: '3',
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
      ],
      total: 40.90,
      status: 'delivered',
      paymentMethod: 'Dinheiro',
      deliveryAddress: 'Rua das Flores, 123',
      deliveryFee: 5.00,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
  ]);

  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      tenantId: 'tenant-1',
      name: 'João Silva',
      phone: '(11) 99999-9999',
      email: 'joao@email.com',
      addresses: [
        {
          id: '1',
          street: 'Rua das Flores, 123',
          neighborhood: 'Centro',
          city: 'São Paulo',
          zipCode: '01234-567',
          isDefault: true,
        },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      tenantId: 'tenant-1',
      name: 'Maria Santos',
      phone: '(11) 88888-8888',
      email: 'maria@email.com',
      addresses: [
        {
          id: '2',
          street: 'Av. Principal, 456',
          neighborhood: 'Vila Nova',
          city: 'São Paulo',
          zipCode: '01234-890',
          isDefault: true,
        },
      ],
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const addCustomer = (customer: Customer) => {
    setCustomers(prev => [customer, ...prev]);
  };

  const updateCustomer = (customer: Customer) => {
    setCustomers(prev => prev.map(c => 
      c.id === customer.id ? customer : c
    ));
  };

  return (
    <OrderContext.Provider value={{
      orders,
      customers,
      setOrders,
      setCustomers,
      addOrder,
      updateOrderStatus,
      addCustomer,
      updateCustomer,
    }}>
      {children}
    </OrderContext.Provider>
  );
};
