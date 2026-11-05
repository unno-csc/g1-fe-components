
import { Select } from "@/components/Select";
import { DefaultOptionType } from "antd/es/select";
import { DeploymentUnitOutlined } from "@ant-design/icons";
import {
  renderTruncatedHeaderSelectLabel,
} from "../utils/headerSelectLabel";
import { useAppLayoutStore } from "../../store";
import {
  HEADER_SELECT_CLASSNAME,
  MOBILE_SELECT_WRAPPER_CLASSNAME,
  MOBILE_TREE_SELECT_CLASSNAME,
  POPUP_STYLES,
  SELECT_WRAPPER_CLASSNAME,
  SELECT_WRAPPER_STYLE,
} from "@/constants";

export interface ControlMultiCompanySelectorUIProps {
  optionsCompany: DefaultOptionType[];
  loadingAppLayout: boolean;
}

export const ControlMultiCompanySelectorUI = ({ optionsCompany, loadingAppLayout }: ControlMultiCompanySelectorUIProps) => {
  const { currentCompany, selectCompany } = useAppLayoutStore();

  const onSelect = (value: string) => {
    selectCompany(value);
  };

  const currentCompanyValue =
    currentCompany?.value !== undefined && currentCompany.value !== null
      ? String(currentCompany.value)
      : undefined;

  const currentCompanyLabel =
    optionsCompany.find(opt => String(opt.value) === currentCompanyValue)?.label ?? 'Empresa';

  const selectProps = {
    options: optionsCompany,
    onChange: onSelect,
    value: currentCompanyValue,
    size: 'middle' as const,
    popupMatchSelectWidth: false,
    styles: POPUP_STYLES,
    loading: loadingAppLayout,
  };

  if (optionsCompany.length <= 1) {
    return null;
  }

  return (
    <div className="flex flex-row gap-1">
      <div className={`hidden md:block ${SELECT_WRAPPER_CLASSNAME}`} style={SELECT_WRAPPER_STYLE}>
        <Select
          className={HEADER_SELECT_CLASSNAME}
          {...selectProps}
          placeholder="Seleccione empresa"
          labelRender={renderTruncatedHeaderSelectLabel}
        />
      </div>
      <div
        className={MOBILE_SELECT_WRAPPER_CLASSNAME}
        title={String(currentCompanyLabel)}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center text-sm text-gray-700 transition-colors group-hover:text-warning group-focus-within:text-warning"
        >
          <DeploymentUnitOutlined />
        </span>
        <Select
          className={MOBILE_TREE_SELECT_CLASSNAME}
          {...selectProps}
          suffixIcon={null}
          placement="bottomRight"
        />
      </div>
    </div>
  );
};
