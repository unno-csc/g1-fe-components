import { HEADER_ENVIRONMENT_WATERMARK_LAYER_CLASSNAME, renderHeaderEnvironmentWatermark } from "@/helpers/environmentWatermark";
import { useEnvironment } from "@/hooks/useEnvironment";
import { DefaultOptionType } from "antd/es/select";
import { HeaderOptions } from "./HeaderOptions";
import { IProgram } from "@/interfaces";
import { MenuProps } from "antd";

export interface HeaderLayoutProps {
	optionsCompany: DefaultOptionType[];
	loadingAppLayout: boolean;
	onCloseSession: () => void;
	menuItemsNavigate: (program: IProgram) => void;
	userActions: MenuProps;
}

export const HeaderLayout = ({
	optionsCompany,
	loadingAppLayout,
	onCloseSession,
	menuItemsNavigate,
	userActions,
}: HeaderLayoutProps) => {
	const environment = useEnvironment();
	const headerBackgroundClass = {
		LOCAL: 'bg-primary-700',
		DESARROLLO: 'bg-gray-500',
		QA: 'bg-black-100',
		PRODUCCION: 'bg-primary-700',
	}[environment] ?? 'bg-primary-700';

	return (
		<header className="h-16">
			<div className={`relative overflow-hidden rounded-tr-none rounded-tl-none rounded-br-xl rounded-bl-xl md:rounded-xl h-16 ${headerBackgroundClass}`}>
				{environment !== 'PRODUCCION' && (
					<div
						aria-hidden="true"
						className={`${HEADER_ENVIRONMENT_WATERMARK_LAYER_CLASSNAME} text-gray-75/25`}
					>
						{renderHeaderEnvironmentWatermark(environment)}
					</div>
				)}
				<HeaderOptions
					optionsCompany={optionsCompany}
					loadingAppLayout={loadingAppLayout}
					onCloseSession={onCloseSession}
					menuItemsNavigate={menuItemsNavigate}
					userActions={userActions}
				/>
			</div>
		</header>
	);
};