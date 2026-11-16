import { IProgram, ISubmodule } from '@/interfaces';
import { Home } from './components/Home';

export interface ICardModuleProps {
	handleNavigateProgram: (program: IProgram | ISubmodule) => void;
}

export const Dashboard = ({ handleNavigateProgram }: ICardModuleProps) => {
	return (
		<div className="w-full h-full flex flex-col overflow-hidden">
			<Home handleNavigateProgram={handleNavigateProgram} />
		</div>
	);
};
