
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import EditProductForm from './EditProductForm';

interface EditProductModalProps {
  isOpen: boolean;
  product: any;
  onClose: () => void;
  onSuccess: () => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ 
  isOpen, 
  product, 
  onClose, 
  onSuccess 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
        </DialogHeader>
        <EditProductForm 
          product={product}
          onClose={onClose} 
          onSuccess={onSuccess} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditProductModal;
