import { Empty as AntEmpty, EmptyProps } from 'antd';

export interface IEmptyProps extends EmptyProps {}

const EmptyRoot = (props: IEmptyProps) => <AntEmpty {...props} />;

export const Empty = EmptyRoot as typeof EmptyRoot & {
	PRESENTED_IMAGE_DEFAULT: React.ReactNode;
	PRESENTED_IMAGE_SIMPLE: React.ReactNode;
};

Empty.PRESENTED_IMAGE_DEFAULT = AntEmpty.PRESENTED_IMAGE_DEFAULT;
Empty.PRESENTED_IMAGE_SIMPLE = AntEmpty.PRESENTED_IMAGE_SIMPLE;
