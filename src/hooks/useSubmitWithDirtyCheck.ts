import { UseFormReturn, FieldValues } from 'react-hook-form';
import { INotificationProps } from '@/components/Notification';

export const useSubmitWithDirtyCheck = <T extends FieldValues>(
	form: UseFormReturn<T>,
	onSubmit: (values: T) => void,
	openNotification: (config: INotificationProps) => void
) => {
	return form.handleSubmit((values) => {
		if (!form.formState.isDirty) {
			openNotification({
				type: 'info',
				title: 'Sin cambios',
				description: 'No se han detectado cambios en la información para actualizar.',
			});
			return;
		}
		onSubmit(values);
	});
};
