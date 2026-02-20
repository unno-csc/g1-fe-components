export interface IMainReportProformaProps {
	children: React.ReactNode;
}

export const MainReportProforma = ({ children }: IMainReportProformaProps) => {
	return (
		<main className="flex-1">
			{children}
		</main>
	);
};