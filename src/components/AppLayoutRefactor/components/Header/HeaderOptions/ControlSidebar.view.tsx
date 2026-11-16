import { Button } from 'antd';
import { MenuUnfoldOutlined } from '@ant-design/icons';
import { logoMotorsBlanco } from '@/assets/images';
import { useSidebarLayoutStore } from '../../store';

export interface ControlSidebarUIProps {
  environment: string;
}

export const ControlSidebarUI = ({ environment }: ControlSidebarUIProps) => {
  const { open, setOpen } = useSidebarLayoutStore();

  return (
    <div className="flex shrink-0 flex-row gap-0.5 items-center justify-center">
      <Button
        type="text"
        icon={<MenuUnfoldOutlined className="text-white-100" />}
        onClick={() => setOpen(!open)}
      />
      {environment !== 'PRODUCCION' && (
        <div className="hidden items-center justify-center rounded-full border border-gray-100 px-3 py-1 md:flex">
          <strong className="text-white-100">{environment}</strong>
        </div>
      )}
      {environment === 'PRODUCCION' && (
        <div className="hidden md:block">
          <img
            src={logoMotorsBlanco}
            alt="Motor 1"
            className="h-full max-h-10 max-w-[150px] object-contain"
          />
        </div>
      )}
    </div>
  );
};