import { Descriptions as AntDescriptions } from 'antd';
import { DescriptionsItemProps as AntDescriptionsItemProps } from 'antd/es/descriptions/Item';

export interface IDescriptionsItemProps extends AntDescriptionsItemProps {}

export const DescriptionsItem = (props: IDescriptionsItemProps) => <AntDescriptions.Item {...props} />;
