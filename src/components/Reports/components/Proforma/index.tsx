import { HeaderReportProforma } from "./HeaderReportProforma";
import { MainReportProforma } from "./MainReportProforma";
import { FooterReportProforma } from "./FooterReportProforma";

export interface IReportProformaContainerProps {
	children: React.ReactNode;
}

export const ReportProformaContainer = ({ children }: IReportProformaContainerProps) => {
	return (
		<div className="flex flex-col bg-white-100 w-[210mm] min-h-[297mm] h-[297mm]">
			<HeaderReportProforma />
			<MainReportProforma>{children}</MainReportProforma>
			<div className="mt-auto">
				<FooterReportProforma />
			</div>
		</div>
	);
};