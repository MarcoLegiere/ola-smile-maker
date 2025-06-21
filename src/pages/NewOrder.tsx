
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus } from 'lucide-react';

interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

export default function NewOrder() {
  const navigate = useNavigate();
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

    // Aqui você integraria com a API para salvar o pedido
    console.log('Novo pedido:', {
      customer: customerInfo,
      items: orderItems,
      total: getTotal()
    });
    
    alert('Pedido criado com sucesso!');
    navigate('/orders');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft size={20} />
                <span>Voltar</span>
              </Button>
              <h1 className="text-2xl font-bold text-orange-600">📋 Novo Pedido</h1>
            </div>
            <Button 
              onClick={handleSubmitOrder}
              disabled={orderItems.length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              Finalizar Pedido
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações do Cliente */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Cliente</CardTitle>
              <CardDescription>Dados para entrega</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          {/* Cardápio */}
          <Card>
            <CardHeader>
              <CardTitle>Cardápio</CardTitle>
              <CardDescription>Selecione os itens</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
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
            </CardContent>
          </Card>

          {/* Pedido Atual */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Itens do Pedido</CardTitle>
              <CardDescription>
                {orderItems.length === 0 ? 'Nenhum item adicionado' : `${orderItems.length} item(s) no pedido`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orderItems.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
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
                      <span>Total:</span>
                      <span className="text-green-600">R$ {getTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
