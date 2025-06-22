import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tenant } from '@/types';
import Navbar from '@/components/Navbar';

export default function SuperAdmin() {
  const [tenants] = useState<Tenant[]>([
    {
      id: 'tenant-1',
      name: 'Pizzaria Bella Vista',
      slug: 'bella-vista',
      phone: '(11) 99999-9999',
      address: 'Rua das Flores, 123 - Centro',
      isActive: true,
      settings: {
        workingHours: {
          monday: { open: '18:00', close: '23:00', isOpen: true },
          tuesday: { open: '18:00', close: '23:00', isOpen: true },
          wednesday: { open: '18:00', close: '23:00', isOpen: true },
          thursday: { open: '18:00', close: '23:00', isOpen: true },
          friday: { open: '18:00', close: '24:00', isOpen: true },
          saturday: { open: '18:00', close: '24:00', isOpen: true },
          sunday: { open: '18:00', close: '23:00', isOpen: true },
        },
        deliveryAreas: [
          { id: '1', name: 'Centro', fee: 3.00 },
          { id: '2', name: 'Bairro Norte', fee: 5.00 },
        ],
        paymentMethods: ['Dinheiro', 'PIX', 'Cartão de Débito', 'Cartão de Crédito'],
        minimumOrder: 25.00,
        isOpen: true,
      },
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      id: 'tenant-2',
      name: 'Pizza Express',
      slug: 'pizza-express',
      phone: '(11) 88888-8888',
      address: 'Av. Principal, 456 - Vila Nova',
      isActive: false,
      settings: {
        workingHours: {
          monday: { open: '19:00', close: '23:00', isOpen: true },
          tuesday: { open: '19:00', close: '23:00', isOpen: true },
          wednesday: { open: '19:00', close: '23:00', isOpen: true },
          thursday: { open: '19:00', close: '23:00', isOpen: true },
          friday: { open: '19:00', close: '24:00', isOpen: true },
          saturday: { open: '19:00', close: '24:00', isOpen: true },
          sunday: { open: '19:00', close: '23:00', isOpen: false },
        },
        deliveryAreas: [
          { id: '1', name: 'Vila Nova', fee: 4.00 },
        ],
        paymentMethods: ['PIX', 'Cartão de Crédito'],
        minimumOrder: 30.00,
        isOpen: false,
      },
      createdAt: '2024-02-01T14:30:00Z',
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Super Administração</h2>
          <Button>+ Nova Pizzaria</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total de Pizzarias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{tenants.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Ativas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {tenants.filter(t => t.isActive).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Inativas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {tenants.filter(t => !t.isActive).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Receita Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">R$ 12.450</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {tenants.map((tenant) => (
            <Card key={tenant.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{tenant.name}</CardTitle>
                    <CardDescription>
                      Criada em {new Date(tenant.createdAt).toLocaleDateString('pt-BR')}
                    </CardDescription>
                  </div>
                  <Badge variant={tenant.isActive ? "default" : "destructive"}>
                    {tenant.isActive ? "Ativa" : "Inativa"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Informações Básicas</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Slug:</strong> {tenant.slug}</p>
                      <p><strong>Telefone:</strong> {tenant.phone}</p>
                      <p><strong>Endereço:</strong> {tenant.address}</p>
                      <p><strong>Pedido Mínimo:</strong> R$ {tenant.settings.minimumOrder.toFixed(2)}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Configurações</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Status:</strong> {tenant.settings.isOpen ? 'Aberta' : 'Fechada'}</p>
                      <p><strong>Áreas de Entrega:</strong> {tenant.settings.deliveryAreas.length}</p>
                      <p><strong>Formas de Pagamento:</strong> {tenant.settings.paymentMethods.length}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Ações</h4>
                    <div className="space-y-2">
                      <Button 
                        variant={tenant.isActive ? "destructive" : "default"} 
                        className="w-full" 
                        size="sm"
                      >
                        {tenant.isActive ? "Desativar" : "Ativar"}
                      </Button>
                      <Button variant="outline" className="w-full" size="sm">
                        Configurar
                      </Button>
                      <Button variant="outline" className="w-full" size="sm">
                        Ver Relatórios
                      </Button>
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
