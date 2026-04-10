import React, { useState, useCallback, useMemo } from 'react';
import { Tooltip } from 'antd';
import { SideRightView } from './SideRightView';
import {
  IVehiclePart,
  IVehiclePartGroup,
  VEHICLE_PARTS_RIGHT_SIDE,
  PATH_TO_PART_MAP,
} from './vehicleParts';

export type { IVehiclePart, IVehiclePartGroup } from './vehicleParts';
export { VEHICLE_PARTS_RIGHT_SIDE, VEHICLE_PART_GROUPS_RIGHT_SIDE } from './vehicleParts';

export type TVehicleView = 'side-right' | 'side-left' | 'front' | 'rear' | 'top';

export interface IVehiclePartSelectorProps {
  view?: TVehicleView;
  selectedParts?: string[];
  onPartClick?: (partId: string, part: IVehiclePart) => void;
  onPartHover?: (partId: string | null, part: IVehiclePart | null) => void;
  onSelectionChange?: (selectedParts: string[]) => void;
  multiSelect?: boolean;
  highlightColor?: string;
  hoverColor?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  disabled?: boolean;
  showTooltip?: boolean;
  partsConfig?: Record<string, IVehiclePart>;
  partGroups?: IVehiclePartGroup[];
}

export const VehiclePartSelector: React.FC<IVehiclePartSelectorProps> = ({
  view = 'side-right',
  selectedParts: controlledSelectedParts,
  onPartClick,
  onPartHover,
  onSelectionChange,
  multiSelect = true,
  highlightColor = '#3b82f6',
  hoverColor = '#93c5fd',
  width = '100%',
  height,
  className = '',
  disabled = false,
  showTooltip = true,
  partsConfig,
  partGroups,
}) => {
  const [internalSelectedParts, setInternalSelectedParts] = useState<string[]>([]);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const isControlled = controlledSelectedParts !== undefined;
  const currentSelectedParts = isControlled ? controlledSelectedParts : internalSelectedParts;

  const currentPartsConfig = partsConfig ?? VEHICLE_PARTS_RIGHT_SIDE;

  const currentPathToPartMap = useMemo(() => {
    if (partGroups) {
      const map: Record<string, string> = {};
      partGroups.forEach((group) => {
        group.pathIds.forEach((pathId: string) => {
          map[pathId] = group.partId;
        });
      });
      return map;
    }
    return PATH_TO_PART_MAP;
  }, [partGroups]);

  const handlePathMouseEnter = useCallback(
    (pathId: string) => {
      if (disabled) return;
      const partId = currentPathToPartMap[pathId];
      if (partId) {
        setHoveredPart(partId);
        const part = currentPartsConfig[partId];
        onPartHover?.(partId, part ?? null);
      }
    },
    [currentPathToPartMap, currentPartsConfig, disabled, onPartHover],
  );

  const handlePathMouseLeave = useCallback(() => {
    setHoveredPart(null);
    onPartHover?.(null, null);
  }, [onPartHover]);

  const handlePathClick = useCallback(
    (pathId: string) => {
      if (disabled) return;
      const partId = currentPathToPartMap[pathId];
      if (!partId) return;

      const part = currentPartsConfig[partId];
      if (part) onPartClick?.(partId, part);

      let newSelection: string[];
      if (multiSelect) {
        newSelection = currentSelectedParts.includes(partId)
          ? currentSelectedParts.filter((id) => id !== partId)
          : [...currentSelectedParts, partId];
      } else {
        newSelection = currentSelectedParts.includes(partId) ? [] : [partId];
      }

      if (!isControlled) {
        setInternalSelectedParts(newSelection);
      }
      onSelectionChange?.(newSelection);
    },
    [
      currentPathToPartMap,
      currentPartsConfig,
      currentSelectedParts,
      disabled,
      isControlled,
      multiSelect,
      onPartClick,
      onSelectionChange,
    ],
  );

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const hoveredPartLabel = hoveredPart ? currentPartsConfig[hoveredPart]?.label : null;

  const renderView = () => {
    const viewProps = {
      hoveredPart,
      selectedParts: currentSelectedParts,
      highlightColor,
      hoverColor,
      pathToPartMap: currentPathToPartMap,
      onPathMouseEnter: handlePathMouseEnter,
      onPathMouseLeave: handlePathMouseLeave,
      onPathClick: handlePathClick,
      disabled,
    };

    switch (view) {
      case 'side-right':
        return <SideRightView {...viewProps} />;
      case 'side-left':
        return (
          <div style={{ transform: 'scaleX(-1)' }}>
            <SideRightView {...viewProps} />
          </div>
        );
      default:
        return <SideRightView {...viewProps} />;
    }
  };

  return (
    <div
      className={`vehicle-part-selector ${className}`}
      style={{
        width,
        height,
        position: 'relative',
        userSelect: 'none',
      }}
      onMouseMove={handleMouseMove}
    >
      {renderView()}
      {showTooltip && hoveredPartLabel && (
        <Tooltip open title={hoveredPartLabel} placement="top">
          <div
            style={{
              position: 'fixed',
              left: tooltipPosition.x,
              top: tooltipPosition.y - 10,
              width: 1,
              height: 1,
              pointerEvents: 'none',
            }}
          />
        </Tooltip>
      )}
    </div>
  );
};
