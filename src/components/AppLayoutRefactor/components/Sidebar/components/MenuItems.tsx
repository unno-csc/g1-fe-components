import { Menu, MenuProps } from "antd";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import { useEffect, useMemo } from "react";
import { getIconByName } from "@/helpers/icons";
import { IProgram, ISubmodule } from "@/interfaces";
import { useAppLayoutStore } from "../../store";
import { collectSubmenuKeys, filterSubmodule } from "./filterSubmoduleMenu";

export interface IMenuItemsProps {
  openKeysMenuOptions: string[];
  onOpenKeysChange: (openKeys: string[]) => void;
  currentPathKeyString?: string;
  searchTerm?: string;
  menuItemsNavigate: (program: IProgram) => void;
}
export type MenuItemsProps = IMenuItemsProps;

const MENU_ICON_SIZE = 16;

export const MenuItems = ({
  currentPathKeyString,
  openKeysMenuOptions,
  onOpenKeysChange,
  searchTerm = '',
  menuItemsNavigate,
}: IMenuItemsProps) => {
  const { module } = useAppLayoutStore();

  const { menuItems, programsByKey } = useMemo(() => {
    if (module === undefined) {
      return {
        menuItems: [],
        programsByKey: new Map<string, IProgram>(),
      };
    }

    const programMap = new Map<string, IProgram>();
    const normalizedSearch = searchTerm.trim();
    const filteredSubmodules = normalizedSearch
      ? module.submodules
          .map(submodule => filterSubmodule(submodule, normalizedSearch))
          .filter((submodule): submodule is ISubmodule => submodule !== null)
      : module.submodules;

    const createSubmoduleItem = (submodule: ISubmodule): ItemType<MenuItemType> | null => {
      const children: ItemType<MenuItemType>[] = [
        ...(submodule.groups ?? [])
          .map(createSubmoduleItem)
          .filter((item): item is ItemType<MenuItemType> => item !== null),
        ...(submodule.programs ?? [])
          .filter((program): program is NonNullable<typeof program> =>
            Boolean(program && program.root !== false)
          )
          .map(program => {
            const key = `program-${program.id}`;
            programMap.set(key, program);

            return {
              key,
              label: program.name,
              icon: getIconByName(program.icon, { size: MENU_ICON_SIZE }),
            };
          }),
      ];

      if (children.length === 0) {
        return null;
      }

      return {
        key: `submodule-${submodule.id}`,
        label: submodule.name,
        icon: getIconByName(submodule.icon, { size: MENU_ICON_SIZE }),
        children,
      };
    };

    const moduleChildren = filteredSubmodules
      .map(createSubmoduleItem)
      .filter((item): item is ItemType<MenuItemType> => item !== null);

    return {
      menuItems: moduleChildren,
      programsByKey: programMap,
    };
  }, [module, searchTerm]);

  useEffect(() => {
    if (!searchTerm.trim()) return;

    onOpenKeysChange(collectSubmenuKeys(menuItems));
  }, [menuItems, onOpenKeysChange, searchTerm]);

  const handleMenuClick: MenuProps['onClick'] = info => {
    const selectedProgram = programsByKey.get(info.key);

    if (selectedProgram !== undefined) {
      menuItemsNavigate(selectedProgram);
    }
  }

  return (
    <div className="menu-options flex flex-1 min-h-0 flex-col overflow-auto scrollbar-none">
      <Menu
        mode="inline"
        inlineIndent={12}
        items={menuItems}
        selectedKeys={currentPathKeyString ? [currentPathKeyString] : []}
        className="overflow-auto scrollbar-none border-none min-w-full bg-transparent text-xs"
        openKeys={openKeysMenuOptions}
        onOpenChange={onOpenKeysChange}
        onClick={handleMenuClick}
      />
    </div>
  );
}