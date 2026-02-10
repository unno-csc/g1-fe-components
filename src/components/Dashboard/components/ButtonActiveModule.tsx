import { ButtonAntd } from '@/components/ButtonAntd';
import { getIcon } from '@/helpers/menu/menuDataTransformer';

export interface IButtonActiveModuleProps {
	name: string;
	icon: string;
	onclick: () => void;
}

export const ButtonActiveModule = ({ name, icon, onclick }: IButtonActiveModuleProps) => {
		return (
		<ButtonAntd
			type="default"
			onClick={onclick}
			className="flex flex-col items-center justify-center min-w-[70px] w-[70px] sm:w-[100px] md:w-[115px] lg:w-[125px] xl:w-[135px] 2xl:w-[145px] h-auto min-h-[70px] sm:min-h-[90px] md:min-h-[105px] lg:min-h-[115px] xl:min-h-[120px] border-2 border-primary-700 bg-white hover:!shadow-lg active:scale-95 py-2 px-1.5 sm:py-2.5 sm:px-2 md:px-2.5 gap-1 sm:gap-1.5 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg transition-all duration-200"
		>
			{getIcon(icon, 'w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 !text-yellow-600 shrink-0')}
			<strong
				className="whitespace-normal text-[8px] leading-[1.2] sm:text-[10px] sm:leading-snug md:text-xs md:leading-tight lg:text-xs xl:text-sm text-gray-800 text-center w-full px-0.5 break-words"
			>
				{name}
			</strong>
		</ButtonAntd>
	);
};
