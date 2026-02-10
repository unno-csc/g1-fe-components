import { Control } from 'react-hook-form';
import { Title } from '../Title';
import { useViewportStore } from '@/store/viewport.store';
import { useViewportSize } from '@/hooks/useViewportSize/useViewportSize';
import { FormLogin, LoginFormValuesBase } from './components/FormLogin';
import { logoMotor1, login1 as loginImage } from '@/assets/images';
import type { FormEventHandler } from 'react';

export interface ILogin<TFieldValues extends LoginFormValuesBase = LoginFormValuesBase> {
	control: Control<TFieldValues>;
	onSubmit?: FormEventHandler<HTMLFormElement>;
	loading?: boolean;
}

export const Login = <TFieldValues extends LoginFormValuesBase = LoginFormValuesBase>({
	control,
	onSubmit,
	loading,
}: ILogin<TFieldValues>) => {
	useViewportSize(0);
	const { width } = useViewportStore();
	const handleSubmit: FormEventHandler<HTMLFormElement> = e => {
		e.preventDefault();
		onSubmit?.(e);
	};
	return (
		<div className="w-full h-[100dvh] bg-gray-75 flex items-center justify-center">
			{width >= 650 && (
				<div className="flex flex-row rounded-2xl max-h-[481px] max-w-[840px] w-full shadow-xl/20 bg-white-100">
					<div className="flex flex-col gap-4 justify-center items-center rounded-tl-2xl w-1/2 rounded-bl-2xl bg-transparent border-t border-l border-gray-200 shadow-l-md p-16">
						<div>
							<img src={logoMotor1} alt="logo" className="w-full h-full max-h-[50px] object-cover" />
						</div>
						<div>
							<Title title="Iniciar sesión" level={4} />
						</div>
						<FormLogin control={control} onSubmit={handleSubmit} loading={loading} />
					</div>
					<div className="bg-white rounded-tr-2xl rounded-br-2xl overflow-hidden flex-1 max-w-[420px]">
						<img src={loginImage} alt="logo" className="w-full h-full max-h-[481px] object-cover" />
					</div>
				</div>
			)}
			{width < 650 && (
				<div className="flex flex-col w-full h-[100dvh]">
					<div className="w-full h-1/3 relative z-0">
						<img src={loginImage} alt="logo" className="w-full h-full max-h-[481px] object-cover" />
					</div>
					<div className="flex-1 flex flex-col gap-4 justify-center items-center rounded-tl-2xl rounded-tr-2xl -mt-5 bg-white relative z-10">
						<div>
							<img src={logoMotor1} alt="logo" className="w-full h-full max-h-[50px] object-cover" />
						</div>
						<div>
							<Title title="Iniciar sesión" level={4} />
						</div>
						<FormLogin control={control} onSubmit={handleSubmit} loading={loading} />
					</div>
				</div>
			)}
		</div>
	);
};
