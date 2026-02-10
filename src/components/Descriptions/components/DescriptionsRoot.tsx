import { Descriptions as AntDescriptions, DescriptionsProps as AntDescriptionsProps } from 'antd';
import { DescriptionsItem } from './DescriptionsItem';

export interface IDescriptionsProps extends AntDescriptionsProps {}

const DescriptionsRoot = (props: IDescriptionsProps) => <AntDescriptions {...props} />;

export const Descriptions = DescriptionsRoot as typeof DescriptionsRoot & {
	Item: typeof DescriptionsItem;
};

Descriptions.Item = DescriptionsItem;
