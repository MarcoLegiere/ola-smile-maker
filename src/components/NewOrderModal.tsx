import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus } from 'lucide-react';
import { Order, Customer } from '@/types';
import CustomerSearch from './CustomerSearch';

interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

interface NewOrderModalProps {
  onOrderCreated: (order: Order) => void;
  ordersCount: number;
}

export default function NewOrderModal({ onOrderCreated, ordersCount }: NewOrderModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
  });
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Mock de clientes (em uma aplicação real, viria do backend)
  const customers: Customer[] = [
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
  ];

  const handleCustomerSelected = (customer: Customer | null) => {
    setSelectedCustomer(customer);
    if (customer) {
      setCustomerInfo({
        name: customer.name,
        phone: customer.phone,
        address: customer.addresses[0] ? 
          `${customer.addresses[0].street}, ${customer.addresses[0].neighborhood}, ${customer.addresses[0].city}` : 
          '',
      });
    } else {
      setCustomerInfo({
        name: '',
        phone: '',
        address: '',
      });
    }
  };

  const menuItems = [
    { id: '1', name: 'Pizza Margherita', price: 35.90 },
    { id: '2', name: 'Pizza Pepperoni', price: 42.90 },
    { id: '3', name: 'Pizza Calabresa', price: 38.90 },
    { id: '4', name: 'Coca-Cola 2L', price: 8.90 },
    { id: '5', name: 'Guaraná 2L', price: 8.90 },
  ];

  const addItem = (item: typeof menuItems[0]) => {
    const existingItem = orderItems.find(orderItem => orderItem.productId === item.id);
    
    if (existingItem) {
      setOrderItems(orderItems.map(orderItem =>
        orderItem.productId === item.id
          ? { ...orderItem, quantity: orderItem.quantity + 1 }
          : orderItem
      ));
    } else {
      setOrderItems([...orderItems, {
        productId: item.id,
        productName: item.name,
        price: item.price,
        quantity: 1
      }]);
    }
  };

  const removeItem = (productId: string) => {
    const existingItem = orderItems.find(item => item.productId === productId);
    
    if (existingItem && existingItem.quantity > 1) {
      setOrderItems(orderItems.map(item =>
        item.productId === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    } else {
      setOrderItems(orderItems.filter(item => item.productId !== productId));
    }
  };

  const getTotal = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmitOrder = () => {
    if (orderItems.length === 0) {
      alert('Adicione pelo menos um item ao pedido');
      return;
    }
    
    if (!customerInfo.name || !customerInfo.phone) {
      alert('Preencha as informações do cliente');
      return;
    }

    const newOrder: Order = {
      id: (ordersCount + 1).toString(),
      tenantId: 'tenant-1',
      customerId: selectedCustomer?.id || 'new-customer',
      items: orderItems.map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.price,
        total: item.price * item.quantity,
      })),
      total: getTotal() + 5.00,
      status: 'pending',
      paymentMethod: 'A definir',
      deliveryAddress: customerInfo.address,
      deliveryFee: 5.00,
      createdAt: new Date().toISOString(),
    };

    onOrderCreated(newOrder);
    setIsModalOpen(false);
    setOrderItems([]);
    setCustomerInfo({ name: '', phone: '', address: '' });
    setSelectedCustomer(null);
    alert('Pedido criado com sucesso!');
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button>+ Novo Pedido</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Pedido</DialogTitle>
          <DialogDescription>
            Criar um novo pedido para entrega
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações do Cliente */}
          <div className="space-y-4">
            <h3 className="font-semibold">Informações do Cliente</h3>
            
            <CustomerSearch 
              customers={customers}
              onCustomerSelected={handleCustomerSelected}
            />
            
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <input
                type="text"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Nome do cliente"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Telefone</label>
              <input
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="(11) 99999-9999"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Endereço</label>
              <textarea
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Endereço completo para entrega"
                rows={3}
              />
            </div>
          </div>

          {/* Cardápio */}
          <div className="space-y-4">
            <h3 className="font-semibold">Cardápio</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {menuItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">R$ {item.price.toFixed(2)}</p>
                  </div>
                  <Button
                    onClick={() => addItem(item)}
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Itens do Pedido */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-semibold">Itens do Pedido</h3>
            {orderItems.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Adicione itens do cardápio para começar o pedido
              </p>
            ) : (
              <div className="space-y-3">
                {orderItems.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-600">R$ {item.price.toFixed(2)} cada</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        onClick={() => removeItem(item.productId)}
                        size="sm"
                        variant="outline"
                      >
                        <Minus size={16} />
                      </Button>
                      <Badge variant="secondary" className="px-3 py-1">
                        {item.quantity}
                      </Badge>
                      <Button
                        onClick={() => addItem({ id: item.productId, name: item.productName, price: item.price })}
                        size="sm"
                        variant="outline"
                      >
                        <Plus size={16} />
                      </Button>
                      <p className="font-medium min-w-20 text-right">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total (+ R$ 5,00 entrega):</span>
                    <span className="text-green-600">R$ {(getTotal() + 5.00).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setIsModalOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmitOrder}
            disabled={orderItems.length === 0}
            className="bg-green-600 hover:bg-green-700"
          >
            Finalizar Pedido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
