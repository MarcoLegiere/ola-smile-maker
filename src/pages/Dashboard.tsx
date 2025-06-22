
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Plus, Pizza, Users, BarChart } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useOrders } from '@/contexts/OrderContext';
import { useOrderStats } from '@/hooks/useOrderStats';

export default function Dashboard() {
  const navigate = useNavigate();
  const { orders } = useOrders();
  const stats = useOrderStats(orders);

  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'preparing': return 'Em preparo';
      case 'out_for_delivery': return 'Saiu para entrega';
      case 'delivered': return 'Entregue';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pedidos Hoje</CardTitle>
              <CardDescription>Total de pedidos recebidos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.todayOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Faturamento</CardTitle>
              <CardDescription>Vendas do dia</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                R$ {stats.todayRevenue.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pedidos Ativos</CardTitle>
              <CardDescription>Em preparo ou entrega</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.activeOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Ticket Médio</CardTitle>
              <CardDescription>Valor médio dos pedidos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                R$ {stats.averageTicket.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Recentes</CardTitle>
              <CardDescription>Últimos pedidos recebidos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Pedido #{order.id.padStart(4, '0')}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">R$ {order.total.toFixed(2)}</p>
                      <Badge variant="secondary" className="text-xs">
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>Acessos mais utilizados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={() => navigate('/orders')} 
                  className="h-16 flex flex-col items-center justify-center space-y-1"
                >
                  <Plus size={20} />
                  <span className="text-sm">Novo Pedido</span>
                </Button>
                <Button 
                  onClick={() => navigate('/menu')} 
                  variant="outline" 
                  className="h-16 flex flex-col items-center justify-center space-y-1"
                >
                  <Pizza size={20} />
                  <span className="text-sm">Cardápio</span>
                </Button>
                <Button 
                  onClick={() => navigate('/customers')} 
                  variant="outline" 
                  className="h-16 flex flex-col items-center justify-center space-y-1"
                >
                  <Users size={20} />
                  <span className="text-sm">Clientes</span>
                </Button>
                <Button 
                  onClick={() => navigate('/reports')} 
                  variant="outline" 
                  className="h-16 flex flex-col items-center justify-center space-y-1"
                >
                  <BarChart size={20} />
                  <span className="text-sm">Relatórios</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
