
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Tenant, User } from '@/types';
import Navbar from '@/components/Navbar';
import UserModal from '@/components/UserModal';
import { Users, Building2, DollarSign, Activity, Search, Plus, Edit, Trash2 } from 'lucide-react';

export default function SuperAdmin() {
  const [tenants] = useState<Tenant[]>([
    {
      id: 'tenant-1',
      name: 'Pizzaria Bella Vista',
      slug: 'bella-vista',
      phone: '(11) 99999-9999',
      address: 'Rua das Flores, 123 - Centro',
      isActive: true,
      usersCount: 2,
      monthlyRevenue: 8500.00,
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
      usersCount: 2,
      monthlyRevenue: 3950.00,
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

  const [users, setUsers] = useState<User[]>([
    {
      id: '2',
      email: 'bellavista@admin.com',
      name: 'João Silva',
      role: 'admin',
      tenantId: 'tenant-1',
      isActive: true,
      createdAt: '2024-01-15T00:00:00Z',
      lastLogin: '2024-06-23T18:30:00Z',
    },
    {
      id: '3',
      email: 'bellavista@atendente.com',
      name: 'Maria Santos',
      role: 'attendant',
      tenantId: 'tenant-1',
      isActive: true,
      createdAt: '2024-02-01T00:00:00Z',
      lastLogin: '2024-06-24T09:15:00Z',
    },
    {
      id: '4',
      email: 'express@admin.com',
      name: 'Carlos Oliveira',
      role: 'admin',
      tenantId: 'tenant-2',
      isActive: true,
      createdAt: '2024-02-01T00:00:00Z',
      lastLogin: '2024-06-20T16:45:00Z',
    },
    {
      id: '5',
      email: 'express@atendente.com',
      name: 'Ana Costa',
      role: 'attendant',
      tenantId: 'tenant-2',
      isActive: false,
      createdAt: '2024-03-01T00:00:00Z',
      lastLogin: '2024-06-10T14:20:00Z',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const handleCreateUser = () => {
    setSelectedUser(null);
    setModalMode('create');
    setUserModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setModalMode('edit');
    setUserModalOpen(true);
  };

  const handleSaveUser = (userData: Partial<User>) => {
    if (modalMode === 'create') {
      setUsers([...users, userData as User]);
    } else {
      setUsers(users.map(u => u.id === userData.id ? { ...u, ...userData } : u));
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenants.find(t => t.id === user.tenantId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTenantName = (tenantId: string) => {
    return tenants.find(t => t.id === tenantId)?.name || 'N/A';
  };

  const totalRevenue = tenants.reduce((sum, tenant) => sum + (tenant.monthlyRevenue || 0), 0);
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.isActive).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Super Administração</h2>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="tenants">Pizzarias</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Total de Pizzarias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{tenants.length}</div>
                  <p className="text-sm text-muted-foreground">
                    {tenants.filter(t => t.isActive).length} ativas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Total de Usuários
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">{totalUsers}</div>
                  <p className="text-sm text-muted-foreground">
                    {activeUsers} ativos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Status Geral
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">
                    {Math.round((activeUsers / totalUsers) * 100)}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Taxa de usuários ativos
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Receita Total
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-600">
                    R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receita mensal estimada
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tenants">
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
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      <div>
                        <h4 className="font-semibold mb-2">Informações Básicas</h4>
                        <div className="text-sm space-y-1">
                          <p><strong>Slug:</strong> {tenant.slug}</p>
                          <p><strong>Telefone:</strong> {tenant.phone}</p>
                          <p><strong>Endereço:</strong> {tenant.address}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Estatísticas</h4>
                        <div className="text-sm space-y-1">
                          <p><strong>Usuários:</strong> {tenant.usersCount}</p>
                          <p><strong>Receita Mensal:</strong> R$ {tenant.monthlyRevenue?.toFixed(2)}</p>
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
          </TabsContent>

          <TabsContent value="users">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Search className="h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Buscar usuários..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-80"
                  />
                </div>
                <Button onClick={handleCreateUser}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Usuário
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Gerenciar Usuários</CardTitle>
                  <CardDescription>
                    Gerencie os usuários de todas as pizzarias do sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Cargo</TableHead>
                        <TableHead>Pizzaria</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Último Login</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                              {user.role === 'admin' ? 'Administrador' : 'Atendente'}
                            </Badge>
                          </TableCell>
                          <TableCell>{getTenantName(user.tenantId || '')}</TableCell>
                          <TableCell>
                            <Badge variant={user.isActive ? 'default' : 'destructive'}>
                              {user.isActive ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.lastLogin ? 
                              new Date(user.lastLogin).toLocaleDateString('pt-BR') : 
                              'Nunca'
                            }
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditUser(user)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <UserModal
          isOpen={userModalOpen}
          onClose={() => setUserModalOpen(false)}
          onSave={handleSaveUser}
          user={selectedUser}
          tenants={tenants}
          mode={modalMode}
        />
      </main>
    </div>
  );
}
