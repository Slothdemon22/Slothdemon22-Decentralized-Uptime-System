import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AddWebsiteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWebsite: (url: string) => void;
}

export function AddWebsiteDialog({ isOpen, onClose, onAddWebsite }: AddWebsiteDialogProps) {
  const [url, setUrl] = useState('');

  const handleAddWebsite = () => {
    if (url) {
      onAddWebsite(url);
      setUrl('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1A1A1A] border-[#333] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-inter font-semibold">Add New Website</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <Input
            type="text"
            placeholder="Enter website URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-2 rounded bg-[#252525] text-white"
          />
          <Button onClick={handleAddWebsite} className="w-full bg-[#2ECC71] text-black">Add Website</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
