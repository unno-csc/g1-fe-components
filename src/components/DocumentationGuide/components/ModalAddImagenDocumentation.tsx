import { IUploadImageProps, UploadImage } from '@/components/UploadImage';

export interface IModalAddImagenDocumentationProps extends IUploadImageProps {}

export const ModalAddImagenDocumentation = (props: IModalAddImagenDocumentationProps) => {
	return <UploadImage {...props} />;
};