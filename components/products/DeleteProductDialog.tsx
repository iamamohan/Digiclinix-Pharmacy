'use client';

import React from 'react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { SerializedProduct } from '@/types/product';

export interface DeleteProductDialogProps {
  isOpen: boolean;
  product: SerializedProduct | null;
  onClose: () => void;
  onConfirmDelete: (id: string) => Promise<void> | void;
  isDeleting?: boolean;
}

export const DeleteProductDialog: React.FC<DeleteProductDialogProps> = ({
  isOpen,
  product,
  onClose,
  onConfirmDelete,
  isDeleting = false,
}) => {
  if (!product) return null;

  const handleConfirm = () => {
    return onConfirmDelete(product.id);
  };

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title={`Delete "${product.name}"?`}
      description={`Are you sure you want to delete "${product.name}"? This action cannot be undone and will permanently remove the product from the Digiclinix catalog.`}
      confirmText="Delete Product"
      cancelText="Cancel"
      isConfirming={isDeleting}
      variant="danger"
    />
  );
};
