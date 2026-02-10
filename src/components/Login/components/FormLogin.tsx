import { Button } from '@/components/Button';
import { FormInput } from '@/components/FormInput';
import { FormInputPassword } from '@/components/FormInputPassword';
import { Control, Path } from 'react-hook-form';
import type { FormEventHandler } from 'react';

export type LoginFormValuesBase = { username: string; password: string };

export interface IFormLogin<TFieldValues extends LoginFormValuesBase = LoginFormValuesBase> {
	control: Control<TFieldValues>;
	onSubmit?: FormEventHandler<HTMLFormElement>;
	loading?: boolean;
}
export const FormLogin = <TFieldValues extends LoginFormValuesBase = LoginFormValuesBase>({ control, onSubmit, loading }: IFormLogin<TFieldValues>) => {
	return (
		<form className="flex flex-col gap-4 w-full p-8" onSubmit={onSubmit}>
			<FormInput
				name={"username" as Path<TFieldValues>}
				label="Usuario"
				placeholder="Ej. juan.pérez@unno-csc.ec"
				control={control}
				textTransform="none"
			/>
			<FormInputPassword
				type="password"
				name={"password" as Path<TFieldValues>}
				label="Contraseña"
				placeholder="**********"
				control={control}
			/>
			<Button
				type="primary"
				htmlType="submit"
				size="middle"
				label="Iniciar sesión"
				loading={loading}
			/>
		</form>
	);
};
