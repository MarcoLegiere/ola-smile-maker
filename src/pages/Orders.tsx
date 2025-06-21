import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Order } from '@/types';
import { Plus, Minus } from 'lucide-react';

interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const menuItems = [
    { id: '1', name: 'Pizza Margherita', price: 35.90 },
    { id: '2', name: 'Pizza Pepperoni', price: 42.90 },
    { id: '3', name: 'Pizza Calabresa', price: 38.90 },
    { id: '4', name: 'Coca-Cola 2L', price: 8.90 },
    { id: '5', name: 'Guaraná 2L', price: 8.90 },
  ];

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

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
      id: (orders.length + 1).toString(),
      tenantId: 'tenant-1',
      customerId: 'new-customer',
      items: orderItems.map(item => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.price,
        total: item.price * item.quantity,
      })),
      total: getTotal() + 5.00, // including delivery fee
      status: 'pending',
      paymentMethod: 'A definir',
      deliveryAddress: customerInfo.address,
      deliveryFee: 5.00,
      createdAt: new Date().toISOString(),
    };

    setOrders([newOrder, ...orders]);
    setIsModalOpen(false);
    setOrderItems([]);
    setCustomerInfo({ name: '', phone: '', address: '' });
    alert('Pedido criado com sucesso!');
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'out_for_delivery': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'preparing': return 'Em Preparo';
      case 'out_for_delivery': return 'Saiu para Entrega';
      case 'delivered': return 'Entregue';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-orange-600">📋 Gerenciar Pedidos</h1>
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
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">3</div>
                <div className="text-sm text-gray-600">Pendentes</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">5</div>
                <div className="text-sm text-gray-600">Em Preparo</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">2</div>
                <div className="text-sm text-gray-600">Saindo</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">15</div>
                <div className="text-sm text-gray-600">Entregues Hoje</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      Pedido #{order.id.padStart(4, '0')}
                    </CardTitle>
                    <CardDescription>
                      {new Date(order.createdAt).toLocaleString('pt-BR')}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Itens do Pedido</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.quantity}x {item.productName}</span>
                          <span>R$ {item.total.toFixed(2)}</span>
                        </div>
                      ))}
                      {order.deliveryFee > 0 && (
                        <div className="flex justify-between text-sm border-t pt-2">
                          <span>Taxa de entrega</span>
                          <span>R$ {order.deliveryFee.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-semibold border-t pt-2">
                        <span>Total</span>
                        <span>R$ {order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Informações de Entrega</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Endereço:</strong> {order.deliveryAddress}</p>
                      <p><strong>Pagamento:</strong> {order.paymentMethod}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Ações</h4>
                    <div className="space-y-2">
                      {order.status === 'pending' && (
                        <Button 
                          className="w-full" 
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                        >
                          Iniciar Preparo
                        </Button>
                      )}
                      {order.status === 'preparing' && (
                        <Button 
                          className="w-full" 
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                        >
                          Enviar para Entrega
                        </Button>
                      )}
                      {order.status === 'out_for_delivery' && (
                        <Button 
                          className="w-full" 
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                        >
                          Marcar como Entregue
                        </Button>
                      )}
                      <Button variant="outline" className="w-full" size="sm">
                        Ver Detalhes
                      </Button>
                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <Button 
                          variant="destructive" 
                          className="w-full" 
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
