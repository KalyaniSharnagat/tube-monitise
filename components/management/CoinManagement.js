'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Coins, Plus } from 'lucide-react';

export function CoinManagement() {
  const [coinPackages, setCoinPackages] = useState([
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCoin, setNewCoin] = useState({ name: '', coins: '', price: '', popular: false });

  const handleCreateCoin = () => {
    if (!newCoin.name || !newCoin.coins || !newCoin.price) return alert("All fields are required!");
    
    const id = coinPackages.length + 1;
    setCoinPackages([...coinPackages, { ...newCoin, id }]);
    setNewCoin({ name: '', coins: '', price: '', popular: false });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Coin Packages */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">Coin Packages</CardTitle>
          <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Coin
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {coinPackages.map((pkg) => (
              <Card key={pkg.id} className={`relative ${pkg.popular ? 'ring-2 ring-green-500' : ''}`}>
                {pkg.popular && (
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-green-500">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Coins className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{pkg.name}</h3>
                  <p className="text-3xl font-bold text-yellow-600 mb-2">{pkg.coins}</p>
                  <p className="text-sm text-muted-foreground mb-4">coins</p>
                  <p className="text-2xl font-bold text-green-600 mb-4">{pkg.price}</p>
                  <Button className="w-full" variant="outline" size="sm">Edit Package</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h3 className="text-lg font-semibold mb-4">Create New Coin Package</h3>
            <Input
              placeholder="Package Name"
              value={newCoin.name}
              onChange={(e) => setNewCoin({ ...newCoin, name: e.target.value })}
              className="mb-3"
            />
            <Input
              placeholder="Coins"
              type="number"
              value={newCoin.coins}
              onChange={(e) => setNewCoin({ ...newCoin, coins: parseInt(e.target.value) })}
              className="mb-3"
            />
            <Input
              placeholder="Price ($)"
              value={newCoin.price}
              onChange={(e) => setNewCoin({ ...newCoin, price: e.target.value })}
              className="mb-3"
            />
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={newCoin.popular}
                onChange={(e) => setNewCoin({ ...newCoin, popular: e.target.checked })}
                className="mr-2"
              />
              <label>Mark as Most Popular</label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateCoin}>Create</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
