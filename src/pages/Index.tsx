
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-orange-600 mb-4">🍕</h1>
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Pizza Manager</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Sistema completo de gerenciamento para pizzarias. Gerencie pedidos, cardápio, 
            clientes e entregas em uma plataforma moderna e eficiente.
          </p>
          <Button size="lg" onClick={() => navigate('/login')} className="text-lg px-8 py-3">
            Acessar Sistema
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                📋 <span className="ml-2">Gestão de Pedidos</span>
              </CardTitle>
              <CardDescription>
                Receba e gerencie pedidos online em tempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-gray-600">
                <li>• Pedidos online automatizados</li>
                <li>• Status em tempo real</li>
                <li>• Impressão automática</li>
                <li>• Histórico completo</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                🍕 <span className="ml-2">Cardápio Digital</span>
              </CardTitle>
              <CardDescription>
                Gerencie seus produtos de forma simples e intuitiva
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-gray-600">
                <li>• Editor visual de cardápio</li>
                <li>• Categorias e opções</li>
                <li>• Controle de disponibilidade</li>
                <li>• Personalização de pizzas</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                👥 <span className="ml-2">Gestão de Clientes</span>
              </CardTitle>
              <CardDescription>
                Mantenha seus clientes sempre próximos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-gray-600">
                <li>• Cadastro automático</li>
                <li>• Múltiplos endereços</li>
                <li>• Histórico de pedidos</li>
                <li>• Dados organizados</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                🏍️ <span className="ml-2">Controle de Entregas</span>
              </CardTitle>
              <CardDescription>
                Gerencie suas entregas com eficiência
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-gray-600">
                <li>• Cadastro de entregadores</li>
                <li>• Áreas de entrega</li>
                <li>• Cálculo de taxas</li>
                <li>• Status de entrega</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                💳 <span className="ml-2">Pagamentos</span>
              </CardTitle>
              <CardDescription>
                Aceite diversos tipos de pagamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-gray-600">
                <li>• PIX automático</li>
                <li>• Cartões de débito/crédito</li>
                <li>• Dinheiro na entrega</li>
                <li>• Relatórios financeiros</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                📊 <span className="ml-2">Relatórios</span>
              </CardTitle>
              <CardDescription>
                Acompanhe o desempenho do seu negócio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-gray-600">
                <li>• Vendas por período</li>
                <li>• Produtos mais vendidos</li>
                <li>• Análise de clientes</li>
                <li>• Dashboard em tempo real</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">
            Pronto para revolucionar sua pizzaria?
          </p>
          <Button size="lg" onClick={() => navigate('/login')} className="text-lg px-8 py-3">
            Começar Agora
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
