import { TextAreaProps } from 'antd/es/input';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { FormLabel } from '@/components/FormLabel';
import { FormLabelError } from '@/components/FormLabelError';
import { Textarea } from '@/components/Textarea/Textarea';
import { memo, useId, useMemo } from 'react';
import classNames from 'classnames';
import { TTextTransform } from '@/types';
import { useFormConfig } from '../FormConfigProvider';

export interface IFormTextareaProps<TFieldValues extends FieldValues> extends Omit<TextAreaProps, 'form' | 'name'> {
  name: Path<TFieldValues>;
  label: string;
  control: Control<TFieldValues>;
  showCaracteres?: boolean;
  showDirtyState?: boolean;
  placeholder?: string;
  errorIdentificationExists?: string;
  autoComplete?: string;
  disabled?: boolean;
  textTransform?: TTextTransform;
}

const FormTextareaComponent = <TFieldValues extends FieldValues>({
  name,
  label,
  control,
  placeholder,
  errorIdentificationExists,
  autoComplete = 'off',
  disabled = false,
  textTransform = 'none',
  showDirtyState,
  ...rest
}: IFormTextareaProps<TFieldValues>) => {
  const { showDirtyState: contextShowDirtyState } = useFormConfig();
  const isDirtyStateActive = showDirtyState ?? contextShowDirtyState;

  const id = useId();
  const errId = `${id}-error`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const errorMsg = fieldState.error?.message as string | undefined;
        const validatMsg = useMemo(() => {
          if (errorMsg) {
            return errorMsg;
          }
          if (errorIdentificationExists) {
            return errorIdentificationExists;
          }
          return undefined;
        }, [errorMsg, errorIdentificationExists]);

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          const inputValue = e.target.value ?? '';
          let transformedValue = inputValue;

          if (textTransform === 'uppercase') {
            transformedValue = inputValue.toUpperCase();
          } else if (textTransform === 'lowercase') {
            transformedValue = inputValue.toLowerCase();
          }

          field.onChange(transformedValue);
        };
        return (
          <div className={classNames("flex flex-col gap-1", { 'dirty-field': isDirtyStateActive && fieldState.isDirty })}>
            <FormLabel label={label} htmlFor={id} />
            <Textarea
              id={id as string}
              value={field.value}
              onChange={handleChange}
              onBlur={field.onBlur}
              name={field.name}
              status={validatMsg ? 'error' : undefined}
              aria-invalid={!!validatMsg}
              aria-describedby={validatMsg ? errId : undefined}
              placeholder={placeholder}
              autoComplete={autoComplete}
              disabled={disabled}
              style={{ textTransform: textTransform }}
              {...rest}
            />
            {(validatMsg || errorIdentificationExists) && <FormLabelError label={validatMsg ?? ''} id={errId} />}
          </div>
        );
      }}
    />
  );
};

export const FormTextarea = memo(FormTextareaComponent) as typeof FormTextareaComponent & {
  displayName?: string;
};

FormTextarea.displayName = 'FormTextarea';
