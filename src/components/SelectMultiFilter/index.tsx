import { IFiltersSelectMultiFilter, SelectMultiFilterProps } from "@/interfaces";
import { useDebouncedCallback } from "@/hooks";
import { CloseCircleFilled } from "@ant-design/icons";
import { Input, Spin, Empty } from "antd";
import { useEffect, useRef, useState } from "react";

const compactControlStyle: React.CSSProperties = {
    height: "27px",
    lineHeight: "18px",
    padding: "4px 8px",
    fontSize: "13px",
    boxSizing: "border-box",
};

const FilterField = ({
    label,
    placeholder,
    value,
    onChange,
}: {
    label: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}) => (
    <div className="flex min-w-0 flex-col gap-0.5">
        <small className="truncate text-[11px] font-bold text-gray-600">
            {label}
        </small>
        <Input
            size="small"
            value={value}
            placeholder={placeholder}
            style={compactControlStyle}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

const createFilters = (keys: string[]): IFiltersSelectMultiFilter =>
    Object.fromEntries(keys.map((key) => [key, ""]));

export const SelectMultiFilter = <T extends object,>({
    data,
    loading = false,
    value,
    fields,
    valueKey,
    placeholder = "Seleccione un registro...",

    allowClear = true,
    filtersDebounceMs = 500,

    onFiltersChange,
    onSelect,
    onClear,
}: SelectMultiFilterProps<T>) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);

    const visibleFields = fields.filter((field) => field.visible !== false);
    const visibleFieldKeys = visibleFields.map((field) => field.key);
    const visibleFieldKeysSignature = JSON.stringify(visibleFieldKeys);
    const gridTemplateColumns = `repeat(${Math.max(visibleFields.length, 1)}, minmax(0, 1fr))`;

    const [filters, setFilters] = useState<IFiltersSelectMultiFilter>(() =>
        createFilters(visibleFieldKeys),
    );

    const { debouncedCallback: notifyFiltersChange } = useDebouncedCallback(
        (nextFilters: IFiltersSelectMultiFilter) => {
            onFiltersChange?.(nextFilters);
        },
        filtersDebounceMs,
    );

    const updateFilter = (field: string, nextValue: string) => {
        const newFilters = {
            ...filters,
            [field]: nextValue,
        };

        setFilters(newFilters);
        notifyFiltersChange(newFilters);
    };

    useEffect(() => {
        setFilters((currentFilters) => {
            const nextFilters = createFilters(visibleFieldKeys);

            visibleFieldKeys.forEach((key) => {
                nextFilters[key] = currentFilters[key] ?? "";
            });

            return nextFilters;
        });
        // The serialized keys keep this effect stable when fields is declared inline.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visibleFieldKeysSignature]);

    const handleClear = (event: React.MouseEvent) => {
        event.stopPropagation();
        onClear?.();
    };

    useEffect(() => {
        const listener = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", listener);

        return () => document.removeEventListener("mousedown", listener);
    }, []);

    return (
        <div ref={containerRef} className="relative w-full text-sm">
            <div
                className="flex min-w-0 cursor-pointer items-center rounded-md border border-gray-300 bg-white-100 transition-colors hover:border-primary-400"
                style={compactControlStyle}
                onClick={() => setOpen((prev) => !prev)}
            >
                {value != null ? (
                    <div
                        className="grid min-w-0 flex-1 gap-2 overflow-hidden leading-[18px]"
                        style={{ gridTemplateColumns }}
                    >
                        {visibleFields.map((field, index) => (
                            <span
                                key={field.key}
                                className={`truncate ${
                                    index === 0
                                        ? "font-medium text-gray-900"
                                        : "text-gray-500"
                                }`}
                            >
                                {String(value[field.key] ?? "")}
                            </span>
                        ))}
                    </div>
                ) : (
                    <span className="min-w-0 flex-1 truncate leading-[18px] text-gray-400">
                        {placeholder}
                    </span>
                )}

                {allowClear === true && value != null && (
                    <button
                        type="button"
                        aria-label="Limpiar selección"
                        className="ml-1 flex h-[18px] w-[18px] shrink-0 items-center justify-center text-gray-400 transition-colors hover:text-gray-600"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={handleClear}
                    >
                        <CloseCircleFilled className="text-xs" />
                    </button>
                )}
            </div>

            {open === true && (
                <div
                    className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-gray-300 bg-white-100 shadow-lg"
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    {visibleFields.length > 0 && (
                        <div
                            className="grid gap-2 border-b border-gray-200 bg-gray-50 p-2"
                            style={{ gridTemplateColumns }}
                        >
                            {visibleFields.map((field) => (
                                <FilterField
                                    key={field.key}
                                    label={field.label}
                                    placeholder={field.placeholder}
                                    value={filters[field.key] ?? ""}
                                    onChange={(nextValue) =>
                                        updateFilter(field.key, nextValue)
                                    }
                                />
                            ))}
                        </div>
                    )}

                    <div
                        className="grid gap-2 border-b border-gray-200 bg-gray-100 px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-gray-500"
                        style={{ gridTemplateColumns }}
                    >
                        {visibleFields.map((field) => (
                            <span key={field.key} className="truncate">
                                {field.label}
                            </span>
                        ))}
                    </div>

                    <div className="max-h-44 overflow-y-auto">
                        {loading === true && (
                            <div className="flex justify-center py-4">
                                <Spin size="small" />
                            </div>
                        )}

                        {loading === false && data.length === 0 && (
                            <div className="py-3">
                                <Empty
                                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                                    description={
                                        <span className="text-xs text-gray-400">
                                            Sin resultados
                                        </span>
                                    }
                                />
                            </div>
                        )}

                        {loading === false &&
                            data.map((item) => {
                                const itemKey = item[valueKey];
                                const isSelected =
                                    value != null &&
                                    Object.is(value[valueKey], itemKey);

                                return (
                                    <div
                                        key={String(itemKey)}
                                        className={`grid cursor-pointer gap-2 border-b border-gray-100 px-2.5 py-1.5 text-[13px] transition-colors last:border-b-0 hover:bg-blue-50 ${
                                            isSelected
                                                ? "bg-blue-50/70"
                                                : "bg-white-100"
                                        }`}
                                        style={{ gridTemplateColumns }}
                                        onClick={() => {
                                            onSelect?.(item);
                                            setOpen(false);
                                        }}
                                    >
                                        {visibleFields.map((field, index) => (
                                            <span
                                                key={field.key}
                                                className={`truncate font-bold ${
                                                    index === 0
                                                        ? "text-gray-900"
                                                        : "text-gray-600"
                                                }`}
                                            >
                                                {String(
                                                    item[field.key] ?? "",
                                                )}
                                            </span>
                                        ))}
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}
        </div>
    );
};
