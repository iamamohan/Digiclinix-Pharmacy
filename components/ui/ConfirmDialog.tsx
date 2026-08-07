'use client';

import React from 'react';
import { Modal } from './Modal';
import { DialogHeader } from './DialogHeader';
import { DialogBody } from './DialogBody';
import { DialogFooter } from './DialogFooter';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isConfirming?: boolean;
  variant?: 'danger' | 'primary';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isConfirming = false,
  variant = 'danger',
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" ariaLabelledBy="confirm-dialog-title">
      <DialogHeader title={title} titleId="confirm-dialog-title" onClose={onClose} />

      <DialogBody className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shrink-0">
            <AlertTriangle className="w-5 h-5" aria-hidden="true" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-inter">
            {description}
          </p>
        </div>
      </DialogBody>

      <DialogFooter>
        <Button variant="outline" size="md" onClick={onClose} disabled={isConfirming}>
          {cancelText}
        </Button>
        <Button
          variant={variant}
          size="md"
          onClick={onConfirm}
          isLoading={isConfirming}
          disabled={isConfirming}
        >
          {isConfirming ? `${confirmText}...` : confirmText}
        </Button>
      </DialogFooter>
    </Modal>
  );
};
