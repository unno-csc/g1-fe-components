import { ButtonAntd } from '@/components/ButtonAntd';

export interface IButtonActiveSubmoduleProps {
	name: string;
	icon: string;
	onclick: () => void;
}

export const ButtonActiveSubmodule = ({ name, onclick }: IButtonActiveSubmoduleProps) => {
	return (
		<ButtonAntd
			type="text"
			size="small"
			onClick={onclick}
			className="px-2 sm:px-3 min-h-[35px] h-auto flex items-center justify-center font-medium text-xs sm:text-sm rounded-none text-primary-700 border-0 hover:!text-primary-700 hover:!bg-transparent active:bg-gray-50 transition-all duration-200 whitespace-nowrap"
		>
			<strong className="text-xs sm:text-sm leading-tight">{name}</strong>
		</ButtonAntd>
	);
};
