import { Image as AntdImage } from 'antd';
import type { UploadProps } from 'antd';
import { Icon } from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import { Carousel } from '@/components/Carousel';
import { Button } from '../Button';
import { ImagePreview } from '../ImagePreview';

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

export type DocumentationGuideSectionKey = keyof IDocumentationGuideSections;

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
	loadingImage?: boolean;
	basePathImages?: string;
	addImageCallback?: UploadProps['onChange'];
	handleAddImage?: () => void;
}

const orderedSectionKeys: DocumentationGuideSectionKey[] = [
	'overview',
	'purpose',
	'usage',
	'information',
	'recommendations',
];

const getDefaultSectionTitle = (sectionKey: DocumentationGuideSectionKey, subjectName?: string) => {
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
	if (/^https?:\/\//i.test(imageName)) {
		return imageName;
	}

	if (/^https?:\/\//i.test(basePath)) {
		const normalizedBasePath = basePath.endsWith('/') ? basePath : `${basePath}/`;

		if (/\/files\/?$/i.test(normalizedBasePath)) {
			return `${normalizedBasePath}?key=${encodeURIComponent(imageName)}`;
		}

		return `${normalizedBasePath}${imageName}`;
	}

	const normalizedBasePath = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;

	return `${normalizedBasePath}/${imageName}`;
};

const getImageAlt = (sectionTitle: string, imageName: string, index: number) => {
	const cleanedName = imageName.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ').trim();

	return cleanedName || `${sectionTitle} imagen ${index + 1}`;
};

export interface IPreviewImageProps {
	basePath: string;
	imageName: string;
	sectionTitle: string;
	index: number;
	imageClassName?: string;
}

const renderPreviewImage = ({
	basePath,
	imageName,
	sectionTitle,
	index,
	imageClassName = 'max-h-[320px]',
}: IPreviewImageProps) => {
	const imageSrc = buildImageSrc(basePath, imageName);

	return (
		<div className="flex w-full flex-col gap-2">
			<ImagePreview
				src={imageSrc}
				alt={getImageAlt(sectionTitle, imageName, index)}
				minHeight={imageClassName === 'max-h-[240px]' ? 240 : 320}
				imageClassName={imageClassName}
			/>
		</div>
	);
};

const renderAddImageButton = (
	addImageCallback?: () => void,
) => (
	<Button
		type="secondary"
		onClick={() => addImageCallback?.()}
		label={<div className="flex items-center gap-2">
			<Icon path={mdiPlus} className="h-5 w-5" />
			<span>Agregar imagen</span>
		</div>}
	/>

);

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
	basePathImages,
	addImageCallback,
	handleAddImage,
}: IDocumentationGuideProps) => {
	const additionalImagesBasePath = basePathImages ?? documentationBasePath;

	// const handleAddImage = () => {};

	return (
		<div className={`flex max-h-[80vh] min-w-[90wv] md:min-w-[60vw] flex-col gap-3 overflow-y-auto pr-2 text-sm text-gray-800 ${className}`.trim()}>
			<div className="flex flex-col gap-3">
				<div className="flex flex-row items-start justify-between gap-2">
					<div className="flex flex-col gap-1 w-full">
						<h1 className="text-base font-semibold">{title}</h1>
						<p>{description}</p>
					</div>
					<div className="flex items-center">
						{addImageCallback && renderAddImageButton(handleAddImage)}
					</div>
				</div>
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
								<div className="flex flex-col gap-1">
									{sectionImages.length === 1 ? (
										renderPreviewImage({
											basePath: basePathImages ?? documentationBasePath,
											imageName: sectionImages[0] ?? '',
											sectionTitle,
											index: 0,
										})
									) : (
										<Carousel.Root loop>
											<Carousel.Content aspectRatio="4/3" className="rounded-md bg-slate-50">
												{sectionImages.map((imageName, index) => (
													<Carousel.Item
														key={`${sectionKey}-${imageName}-${index}`}
														className="flex items-center justify-center p-3"
													>
														{renderPreviewImage({
															basePath: basePathImages ?? documentationBasePath,
															imageName,
															sectionTitle,
															index,
														})}
													</Carousel.Item>
												))}
											</Carousel.Content>
											<Carousel.PrevButton />
											<Carousel.NextButton />
											<Carousel.Indicators position="bottom" variant="dots" />
										</Carousel.Root>
									)}
								</div>
							) : (
								<div className="flex min-h-0 flex-1 items-center justify-center text-sm text-gray-400">
									Sin imagen asociada 2
								</div>
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

						<div className="mx-auto w-full max-w-4xl">
							<Carousel.Root loop={additionalImages.length > 1}>
								<Carousel.Content aspectRatio="16/9" className="rounded-md bg-slate-50">
									{additionalImages.map((imageName, index) => (
										<Carousel.Item key={`${imageName}-${index}`} className="flex items-center justify-center p-4 md:p-8">
											{renderPreviewImage({
												basePath: additionalImagesBasePath,
												imageName,
												sectionTitle: additionalImagesTitle,
												index,
												imageClassName: 'max-h-[360px] mx-auto',
											})}
										</Carousel.Item>
									))}
								</Carousel.Content>
								{additionalImages.length > 1 && (
									<>
										<Carousel.PrevButton />
										<Carousel.NextButton />
										<Carousel.Indicators position="bottom" variant="dots" />
									</>
								)}
							</Carousel.Root>
						</div>
					</section>
				)}
			</AntdImage.PreviewGroup>
		</div>
	);
};
