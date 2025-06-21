
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Customer } from '@/types';

export default function Customers() {
  const [customers] = useState<Customer[]>([
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-orange-600">👥 Gerenciar Clientes</h1>
            <Button>+ Novo Cliente</Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{customers.length}</div>
                <div className="text-sm text-gray-600">Total de Clientes</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">8</div>
                <div className="text-sm text-gray-600">Pedidos Este Mês</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">3</div>
                <div className="text-sm text-gray-600">Novos Esta Semana</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {customers.map((customer) => (
            <Card key={customer.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{customer.name}</CardTitle>
                    <CardDescription>
                      Cliente desde: {new Date(customer.createdAt).toLocaleDateString('pt-BR')}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">Ativo</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Informações de Contato</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Telefone:</strong> {customer.phone}</p>
                      {customer.email && (
                        <p><strong>Email:</strong> {customer.email}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Endereços</h4>
                    <div className="space-y-2">
                      {customer.addresses.map((address) => (
                        <div key={address.id} className="text-sm bg-gray-50 p-2 rounded">
                          <p>{address.street}</p>
                          <p>{address.neighborhood}, {address.city}</p>
                          <p>CEP: {address.zipCode}</p>
                          {address.isDefault && (
                            <Badge variant="outline" className="text-xs mt-1">Padrão</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button size="sm">Ver Pedidos</Button>
                  <Button variant="outline" size="sm">Editar</Button>
                  <Button variant="outline" size="sm">Histórico</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
