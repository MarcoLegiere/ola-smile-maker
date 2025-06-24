
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tenant } from '@/types';
import { useForm } from 'react-hook-form';

interface TenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tenant: Partial<Tenant>) => void;
  tenant?: Tenant | null;
  mode: 'create' | 'edit';
}

interface TenantFormData {
  name: string;
  slug: string;
  phone: string;
  address: string;
  isActive: boolean;
  minimumOrder: number;
}

export default function TenantModal({ isOpen, onClose, onSave, tenant, mode }: TenantModalProps) {
  const { register, handleSubmit, watch, reset, setValue } = useForm<TenantFormData>({
    defaultValues: {
      name: '',
      slug: '',
      phone: '',
      address: '',
      isActive: true,
      minimumOrder: 25.00,
    }
  });

  const watchedIsActive = watch('isActive');

  // Reset form when tenant changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (tenant && mode === 'edit') {
        reset({
          name: tenant.name || '',
          slug: tenant.slug || '',
          phone: tenant.phone || '',
          address: tenant.address || '',
          isActive: tenant.isActive ?? true,
          minimumOrder: tenant.settings?.minimumOrder || 25.00,
        });
      } else {
        reset({
          name: '',
          slug: '',
          phone: '',
          address: '',
          isActive: true,
          minimumOrder: 25.00,
        });
      }
    }
  }, [isOpen, tenant, mode, reset]);

  const onSubmit = (data: TenantFormData) => {
    const tenantData: Partial<Tenant> = {
      ...data,
      id: tenant?.id || `tenant-${Date.now()}`,
      createdAt: tenant?.createdAt || new Date().toISOString(),
      usersCount: tenant?.usersCount || 0,
      monthlyRevenue: tenant?.monthlyRevenue || 0,
      settings: {
        workingHours: tenant?.settings?.workingHours || {
          monday: { open: '18:00', close: '23:00', isOpen: true },
          tuesday: { open: '18:00', close: '23:00', isOpen: true },
          wednesday: { open: '18:00', close: '23:00', isOpen: true },
          thursday: { open: '18:00', close: '23:00', isOpen: true },
          friday: { open: '18:00', close: '24:00', isOpen: true },
          saturday: { open: '18:00', close: '24:00', isOpen: true },
          sunday: { open: '18:00', close: '23:00', isOpen: true },
        },
        deliveryAreas: tenant?.settings?.deliveryAreas || [],
        paymentMethods: tenant?.settings?.paymentMethods || ['Dinheiro', 'PIX'],
        minimumOrder: data.minimumOrder,
        isOpen: tenant?.settings?.isOpen ?? true,
      },
    };

    onSave(tenantData);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Novo Estabelecimento' : 'Editar Estabelecimento'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Estabelecimento</Label>
              <Input
                id="name"
                {...register('name', { required: true })}
                placeholder="Ex: Pizzaria Bella Vista"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Identificador (Slug)</Label>
              <Input
                id="slug"
                {...register('slug', { required: true })}
                placeholder="Ex: bella-vista"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                {...register('phone', { required: true })}
                placeholder="(11) 99999-9999"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimumOrder">Pedido Mínimo (R$)</Label>
              <Input
                id="minimumOrder"
                type="number"
                step="0.01"
                {...register('minimumOrder', { required: true })}
                placeholder="25.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço Completo</Label>
            <Input
              id="address"
              {...register('address', { required: true })}
              placeholder="Rua das Flores, 123 - Centro"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={watchedIsActive}
              onCheckedChange={(checked) => setValue('isActive', checked)}
            />
            <Label htmlFor="isActive">Estabelecimento ativo</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {mode === 'create' ? 'Criar Estabelecimento' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
