import { Spin as AntSpin, SpinProps } from 'antd';

export interface ISpinProps extends SpinProps {}

export const Spin = (props: ISpinProps) => <AntSpin {...props} />;
