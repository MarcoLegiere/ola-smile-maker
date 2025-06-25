
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Save } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useTenant } from '@/components/ProtectedRoute';
import { useOrders } from '@/contexts/OrderContext';
import { toast } from 'sonner';

export default function StoreSettings() {
  const { tenantId } = useTenant();
  const { tenants, updateTenant } = useOrders();
  const currentTenant = tenants.find(t => t.id === tenantId);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethods: [] as string[],
    minimumOrder: 0,
    isOpen: true,
  });

  const [newPaymentMethod, setNewPaymentMethod] = useState('');

  useEffect(() => {
    if (currentTenant) {
      setFormData({
        name: currentTenant.name,
        phone: currentTenant.phone,
        address: currentTenant.address,
        paymentMethods: currentTenant.settings.paymentMethods,
        minimumOrder: currentTenant.settings.minimumOrder,
        isOpen: currentTenant.settings.isOpen,
      });
    }
  }, [currentTenant]);

  const handleAddPaymentMethod = () => {
    if (newPaymentMethod.trim() && !formData.paymentMethods.includes(newPaymentMethod.trim())) {
      setFormData({
        ...formData,
        paymentMethods: [...formData.paymentMethods, newPaymentMethod.trim()]
      });
      setNewPaymentMethod('');
    }
  };

  const handleRemovePaymentMethod = (method: string) => {
    setFormData({
      ...formData,
      paymentMethods: formData.paymentMethods.filter(m => m !== method)
    });
  };

  const handleSave = () => {
    if (!currentTenant) return;

    const updatedTenant = {
      ...currentTenant,
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      settings: {
        ...currentTenant.settings,
        paymentMethods: formData.paymentMethods,
        minimumOrder: formData.minimumOrder,
        isOpen: formData.isOpen,
      }
    };

    updateTenant(updatedTenant);
    toast.success('Configurações salvas com sucesso!');
  };

  if (!currentTenant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <p>Estabelecimento não encontrado.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Configurações da Loja</h1>
            <p className="text-gray-600">Gerencie as informações do seu estabelecimento</p>
          </div>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome do Estabelecimento</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Pizzaria Bella Vista"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Endereço Completo</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Rua das Flores, 123 - Centro, São Paulo - SP"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Configurações de Pedido */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minimumOrder">Pedido Mínimo (R$)</Label>
                  <Input
                    id="minimumOrder"
                    type="number"
                    step="0.01"
                    value={formData.minimumOrder}
                    onChange={(e) => setFormData({ ...formData, minimumOrder: parseFloat(e.target.value) || 0 })}
                    placeholder="25.00"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isOpen"
                    checked={formData.isOpen}
                    onCheckedChange={(checked) => setFormData({ ...formData, isOpen: checked })}
                  />
                  <Label htmlFor="isOpen">Loja Aberta</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formas de Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle>Formas de Pagamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.paymentMethods.map((method) => (
                  <Badge key={method} variant="secondary" className="px-3 py-1">
                    {method}
                    <button
                      onClick={() => handleRemovePaymentMethod(method)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newPaymentMethod}
                  onChange={(e) => setNewPaymentMethod(e.target.value)}
                  placeholder="Nova forma de pagamento"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddPaymentMethod()}
                />
                <Button onClick={handleAddPaymentMethod} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
