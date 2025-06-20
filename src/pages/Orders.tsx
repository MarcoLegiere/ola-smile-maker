
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Order } from '@/types';

export default function Orders() {
  const [orders] = useState<Order[]>([
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
            <Button>+ Novo Pedido</Button>
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
                        <Button className="w-full" size="sm">
                          Iniciar Preparo
                        </Button>
                      )}
                      {order.status === 'preparing' && (
                        <Button className="w-full" size="sm">
                          Enviar para Entrega
                        </Button>
                      )}
                      {order.status === 'out_for_delivery' && (
                        <Button className="w-full" size="sm">
                          Marcar como Entregue
                        </Button>
                      )}
                      <Button variant="outline" className="w-full" size="sm">
                        Ver Detalhes
                      </Button>
                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <Button variant="destructive" className="w-full" size="sm">
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
