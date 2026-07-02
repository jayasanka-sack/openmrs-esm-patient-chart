import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, InlineLoading, ModalBody, ModalFooter, ModalHeader, TextArea } from '@carbon/react';
import { showSnackbar } from '@openmrs/esm-framework';
import { deleteProcedure, useMutatePatientProcedures } from '../../procedures.resource';
import styles from './delete-procedure.modal.scss';

type DeleteProcedureModalProps = {
  closeDeleteModal: () => void;
  procedureUuid: string;
  patientUuid: string;
};

const DeleteProcedureModal: React.FC<DeleteProcedureModalProps> = ({
  closeDeleteModal,
  procedureUuid,
  patientUuid,
}) => {
  const { t } = useTranslation();
  const mutate = useMutatePatientProcedures(patientUuid);

  const [isDeleting, setIsDeleting] = useState(false);
  const [voidReason, setVoidReason] = useState('');

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);

    try {
      await deleteProcedure(procedureUuid, voidReason);
      await mutate();

      closeDeleteModal();
      showSnackbar({
        isLowContrast: true,
        kind: 'success',
        title: t('procedureDeleted', 'Procedure deleted'),
      });
    } catch (error) {
      setIsDeleting(false);
      console.error('Error deleting procedure: ', error);

      showSnackbar({
        isLowContrast: false,
        kind: 'error',
        title: t('errorDeletingProcedure', 'Error deleting procedure'),
        subtitle: error?.message,
      });
    }
  }, [closeDeleteModal, procedureUuid, voidReason, mutate, t]);

  return (
    <div>
      <ModalHeader closeModal={closeDeleteModal} title={t('deleteProcedure', 'Delete procedure')} />
      <ModalBody>
        <p className={styles.confirmationText}>
          {t('deleteModalConfirmationText', 'Are you sure you want to delete this procedure?')}
        </p>
        <TextArea
          id="voidReason"
          labelText={t('reasonForDeletion', 'Reason for deletion (optional)')}
          placeholder={t('enterReasonForDeletion', 'Enter a reason for deleting this procedure')}
          value={voidReason}
          onChange={(event) => setVoidReason(event.target.value)}
          rows={3}
        />
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={closeDeleteModal}>
          {t('cancel', 'Cancel')}
        </Button>
        <Button className={styles.deleteButton} kind="danger" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? (
            <InlineLoading description={t('deleting', 'Deleting') + '...'} />
          ) : (
            <span>{t('delete', 'Delete')}</span>
          )}
        </Button>
      </ModalFooter>
    </div>
  );
};

export default DeleteProcedureModal;
