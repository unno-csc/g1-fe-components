import { ReactNode } from 'react';
import { Modal } from 'antd';
import { CustomFooterModal } from '../CustomFooterModal';

export interface IConfirmDeleteDetailItem {
  label: string;
  value: ReactNode;
}

export interface IConfirmDeleteModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  entityName?: string;
  message?: string;
  details?: IConfirmDeleteDetailItem[];
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

export const ConfirmDeleteModal = ({
  open,
  onConfirm,
  onCancel,
  title = 'Confirmar Eliminación',
  entityName = 'registro',
  message,
  details = [],
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  isLoading = false,
}: IConfirmDeleteModalProps) => {
  const displayMessage = message || `¿Está seguro que desea eliminar el siguiente ${entityName}?`;

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      centered
      footer={
        <CustomFooterModal
          onConfirm={onConfirm}
          confirmLabel={confirmLabel}
          onCancel={onCancel}
          cancelLabel={cancelLabel}
          confirmLoading={isLoading}
        />
      }
    >
      <p>{displayMessage}</p>
      {details.length > 0 && (
        <div className="mt-3 p-3 bg-gray-50 rounded-md">
          {details.map((detail, index) => (
            <p key={index}>
              <strong>{detail.label}:</strong> {detail.value}
            </p>
          ))}
        </div>
      )}
    </Modal>
  );
};
