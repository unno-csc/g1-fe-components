import { Image as AntdImage } from 'antd';

export interface IDocumentationGuideSection {
	title?: string;
	content: string[];
	images?: string[];
}

export interface IDocumentationGuideSections {
	overview: IDocumentationGuideSection;
	purpose: IDocumentationGuideSection;
	usage: IDocumentationGuideSection;
	information: IDocumentationGuideSection;
	recommendations: IDocumentationGuideSection;
}

export interface IDocumentationGuideProps {
	title: string;
	description: string;
	subjectName?: string;
	sections: IDocumentationGuideSections;
	additionalImages?: string[];
	additionalImagesTitle?: string;
	additionalImagesDescription?: string;
	documentationBasePath?: string;
	className?: string;
}

const orderedSectionKeys: Array<keyof IDocumentationGuideSections> = [
	'overview',
	'purpose',
	'usage',
	'information',
	'recommendations',
];

const getDefaultSectionTitle = (sectionKey: keyof IDocumentationGuideSections, subjectName?: string) => {
	switch (sectionKey) {
		case 'overview':
			return subjectName ? `Que es ${subjectName}` : 'Que es';
		case 'purpose':
			return 'Para que sirve';
		case 'usage':
			return 'Como usar esta pantalla';
		case 'information':
			return 'Informacion que vas a encontrar';
		case 'recommendations':
			return 'Recomendaciones de uso';
		default:
			return '';
	}
};

const buildImageSrc = (basePath: string, imageName: string) => {
	const normalizedBasePath = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;

	return `${normalizedBasePath}/${imageName}`;
};

const getImageAlt = (sectionTitle: string, imageName: string, index: number) => {
	const cleanedName = imageName.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ').trim();

	return cleanedName || `${sectionTitle} imagen ${index + 1}`;
};

const renderPreviewImage = ({
	basePath,
	imageName,
	sectionTitle,
	index,
	imageClassName = 'max-h-[320px]',
}: {
	basePath: string;
	imageName: string;
	sectionTitle: string;
	index: number;
	imageClassName?: string;
}) => {
	const imageSrc = buildImageSrc(basePath, imageName);

	return (
		<div className="flex w-full flex-col gap-2">
			<div className="overflow-hidden rounded-md border border-gray-200 bg-gray-50">
				<AntdImage
					alt={getImageAlt(sectionTitle, imageName, index)}
					src={imageSrc}
					width="100%"
					className={`cursor-zoom-in object-contain ${imageClassName}`}
					style={{ width: '100%', objectFit: 'contain' }}
					preview={{
						movable: true,
						mask: <span className="text-xs">Click para ampliar</span>,
					}}
				/>
			</div>
			<p className="text-xs text-gray-500">{imageName}</p>
		</div>
	);
};

export const DocumentationGuide = ({
	title,
	description,
	subjectName,
	sections,
	additionalImages = [],
	additionalImagesTitle = 'Imagenes adicionales',
	additionalImagesDescription = 'Material visual complementario de apoyo.',
	documentationBasePath = '/src/assets/documentation',
	className = '',
}: IDocumentationGuideProps) => {
	return (
		<div className={`flex max-h-[80vh] min-w-[90wv] md:min-w-[60vw] flex-col gap-3 overflow-y-auto pr-2 text-sm text-gray-800 ${className}`.trim()}>
			<div className="flex flex-col gap-1">
				<h1 className="text-base font-semibold">{title}</h1>
				<p>{description}</p>
			</div>

			<AntdImage.PreviewGroup>
				{orderedSectionKeys.map((sectionKey) => {
					const section = sections[sectionKey];
					const sectionTitle = section.title ?? getDefaultSectionTitle(sectionKey, subjectName);
					const sectionImages = section.images ?? [];

					return (
						<section
							key={sectionKey}
							className="grid gap-3 rounded-md border border-gray-200 bg-white p-3 lg:grid-cols-[minmax(0,1fr)_320px]"
						>
							<div className="flex flex-col gap-2">
								<h2 className="font-semibold">{sectionTitle}</h2>
								<div className="flex flex-col gap-1">
									{section.content.map((text) => (
										<p key={text}>{text}</p>
									))}
								</div>
							</div>

							{sectionImages.length > 0 ? (
								<div className="grid gap-3">
									{sectionImages.map((imageName, index) =>
										renderPreviewImage({
											basePath: documentationBasePath,
											imageName,
											sectionTitle,
											index,
										}),
									)}
								</div>
							) : (
								<div className="hidden lg:block" />
							)}
						</section>
					);
				})}

				{additionalImages.length > 0 && (
					<section className="flex flex-col gap-3 rounded-md border border-gray-200 bg-white p-3">
						<div className="flex flex-col gap-1">
							<h2 className="font-semibold">{additionalImagesTitle}</h2>
							<p>{additionalImagesDescription}</p>
						</div>

						<div className="grid gap-3 md:grid-cols-2">
							{additionalImages.map((imageName, index) => (
								<div key={imageName} className="flex flex-col gap-2">
									{renderPreviewImage({
										basePath: documentationBasePath,
										imageName,
										sectionTitle: additionalImagesTitle,
										index,
										imageClassName: 'max-h-[240px]',
									})}
								</div>
							))}
						</div>
					</section>
				)}
			</AntdImage.PreviewGroup>
		</div>
	);
};
