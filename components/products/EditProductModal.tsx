'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { DialogHeader } from '@/components/ui/DialogHeader';
import { DialogBody } from '@/components/ui/DialogBody';
import { ProductForm } from './ProductForm';
import { SerializedProduct, ProductFormData } from '@/types/product';

export interface EditProductModalProps {
  isOpen: boolean;
  product: SerializedProduct | null;
  onClose: () => void;
  onUpdate: (id: string, data: ProductFormData) => Promise<void> | void;
  isSubmitting?: boolean;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  product,
  onClose,
  onUpdate,
  isSubmitting = false,
}) => {
  if (!product) return null;

  const initialValues: ProductFormData = {
    name: product.name,
    category: product.category,
    price: product.price,
    description: product.description || '',
    imageUrl: product.imageUrl || '',
    inStock: product.inStock,
    requiresPrescription: product.requiresPrescription,
  };

  const handleSubmit = (data: ProductFormData) => {
    return onUpdate(product.id, data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" ariaLabelledBy="edit-product-modal-title">
      <DialogHeader
        title={`Edit "${product.name}"`}
        subtitle="Update the product details below."
        onClose={onClose}
        titleId="edit-product-modal-title"
      />
      <DialogBody>
        <ProductForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitText="Update Product"
          onCancel={onClose}
        />
      </DialogBody>
    </Modal>
  );
};
