'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { DialogHeader } from '@/components/ui/DialogHeader';
import { DialogBody } from '@/components/ui/DialogBody';
import { ProductForm } from './ProductForm';
import { ProductFormData } from '@/types/product';

export interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: ProductFormData) => Promise<void> | void;
  isSubmitting?: boolean;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  isSubmitting = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" ariaLabelledBy="add-product-modal-title">
      <DialogHeader
        title="Add New Product"
        subtitle="Fill in the healthcare product details below to add it to the catalog."
        onClose={onClose}
        titleId="add-product-modal-title"
      />
      <DialogBody>
        <ProductForm
          onSubmit={onAdd}
          isSubmitting={isSubmitting}
          submitText="Create Product"
          onCancel={onClose}
        />
      </DialogBody>
    </Modal>
  );
};
