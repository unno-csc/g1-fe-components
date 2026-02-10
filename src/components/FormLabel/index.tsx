export interface IFormLabelProps {
	label: string;
	htmlFor?: string;
	optional?: boolean;
}

export const FormLabel = ({ label, htmlFor, optional }: IFormLabelProps) => {
	return (
		<div className="flex w-full items-center justify-between gap-2">
			<label htmlFor={htmlFor} className="font-bold flex-1 min-w-0 truncate" title={label}>
				{label}
			</label>
			{optional === true && <small className="text-gray-500 text-xs shrink-0"> (Opcional)</small>}
		</div>
	);
};