import React, { useState, useEffect } from 'react';
import { PackageSearch, Plus, CalendarDays, AlertTriangle } from 'lucide-react';
import api, { DEMO_HOUSEHOLD_ID } from '../../services/api';
import { format, isBefore, addDays } from 'date-fns';

interface HouseholdItem {
  id: string;
  name: string;
  category: string;
  brand?: string;
  modelNumber?: string;
  warrantyEndDate?: string;
  expiryDate?: string;
}

export function ItemsPage() {
  const [items, setItems] = useState<HouseholdItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Appliance');
  const [brand, setBrand] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [warrantyEndDate, setWarrantyEndDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const res = await api.get(`/householditems?householdId=${DEMO_HOUSEHOLD_ID}`);
      setItems(res.data);
    } catch (err) {
      console.error('Failed to load items', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/householditems?householdId=${DEMO_HOUSEHOLD_ID}`, {
        name,
        category,
        brand,
        modelNumber,
        warrantyEndDate: warrantyEndDate ? new Date(warrantyEndDate).toISOString() : null,
        expiryDate: expiryDate ? new Date(expiryDate).toISOString() : null
      });
      setIsModalOpen(false);
      resetForm();
      loadItems();
    } catch (err) {
      console.error('Failed to save item', err);
    }
  };

  const resetForm = () => {
    setName('');
    setCategory('Appliance');
    setBrand('');
    setModelNumber('');
    setWarrantyEndDate('');
    setExpiryDate('');
  };

  const getWarningStatus = (item: HouseholdItem) => {
    if (item.expiryDate) {
      const expiry = new Date(item.expiryDate);
      const soon = addDays(new Date(), 30);
      if (isBefore(expiry, new Date())) return { text: 'Expired', color: 'text-rose-400 bg-rose-400/10 border-rose-400/20' };
      if (isBefore(expiry, soon)) return { text: 'Expiring Soon', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' };
    }
    if (item.warrantyEndDate) {
      const warranty = new Date(item.warrantyEndDate);
      const soon = addDays(new Date(), 30);
      if (isBefore(warranty, new Date())) return { text: 'Warranty Expired', color: 'text-rose-400 bg-rose-400/10 border-rose-400/20' };
      if (isBefore(warranty, soon)) return { text: 'Warranty Ending Soon', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' };
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text">Household Items</h1>
          <p className="text-text-muted mt-1">Track your appliances, warranties, and product expirations.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="primary-button">
          <Plus size={18} />
          Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => {
          const warning = getWarningStatus(item);
          return (
            <div key={item.id} className="glass-panel p-6 flex flex-col hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-primary/20 p-3 rounded-lg text-primary">
                  <PackageSearch size={24} />
                </div>
                {warning && (
                  <span className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md border ${warning.color}`}>
                    <AlertTriangle size={14} /> {warning.text}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-text truncate">{item.name}</h3>
              <p className="text-sm text-text-muted mb-4">{item.brand} {item.modelNumber}</p>
              
              <div className="mt-auto space-y-2 text-sm">
                {item.warrantyEndDate && (
                  <div className="flex items-center gap-2 text-text-muted">
                    <CalendarDays size={16} />
                    <span>Warranty: {format(new Date(item.warrantyEndDate), 'MMM d, yyyy')}</span>
                  </div>
                )}
                {item.expiryDate && (
                  <div className="flex items-center gap-2 text-text-muted">
                    <CalendarDays size={16} />
                    <span>Expiry: {format(new Date(item.expiryDate), 'MMM d, yyyy')}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-text mb-6">Add Household Item</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-1">Name</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full input-field" placeholder="e.g. Samsung Refrigerator" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">Brand</label>
                  <input type="text" value={brand} onChange={e => setBrand(e.target.value)} className="w-full input-field" placeholder="Samsung" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">Model Number</label>
                  <input type="text" value={modelNumber} onChange={e => setModelNumber(e.target.value)} className="w-full input-field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">Warranty End Date</label>
                  <input type="date" value={warrantyEndDate} onChange={e => setWarrantyEndDate(e.target.value)} className="w-full input-field [color-scheme:dark]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">Product Expiry Date</label>
                  <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className="w-full input-field [color-scheme:dark]" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="glass-button text-text">Cancel</button>
                <button type="submit" className="primary-button">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
