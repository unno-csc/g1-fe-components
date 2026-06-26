import { useCallback, useMemo, useState, useRef } from "react";
import { Upload, Image } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { CloseOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";

import { useNotification } from "../../hooks";
import { Button } from "../Button";
import { compressImage } from "../../utils/imageUtils";
import { IUploadImageCompressorProps } from "./UploadImageCompressor.interface";

export const UploadImageCompressor = ({
  onSaveSuccess,
  onCancel,
  currentImageCount,
  maxImages = 10,
  maxSizeMB = 2,
  acceptedFormats = ".jpg,.jpeg,.png,.webp",
}: IUploadImageCompressorProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [openingExplorer, setOpeningExplorer] = useState(false);
  const { openNotificationWithIcon } = useNotification();

  const availableSlots = Math.max(maxImages - currentImageCount, 0);
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const selectedFiles = useMemo<File[]>(
    () =>
      fileList.reduce<File[]>((acc, file) => {
        if (file.originFileObj) {
          acc.push(file.originFileObj as File);
        }
        return acc;
      }, []),
    [fileList]
  );

  const lastSizeWarningTime = useRef<number>(0);
  const lastCountWarningTime = useRef<number>(0);

  const handleBeforeUpload = useCallback<NonNullable<UploadProps["beforeUpload"]>>(() => false, []);

  const handleChangeUpload: UploadProps["onChange"] = useCallback(
    ({ fileList: nextFileList }: { fileList: UploadFile[] }) => {
      const now = Date.now();

      if (availableSlots <= 0) {
        setFileList([]);
        if (now - lastCountWarningTime.current > 1000) {
          openNotificationWithIcon({
            type: "warning",
            message: `Ya alcanzaste el límite de ${maxImages} imágenes.`,
          });
          lastCountWarningTime.current = now;
        }
        return;
      }

      const validSizeFiles: UploadFile[] = [];
      nextFileList.forEach((file: UploadFile) => {
        const size = file.originFileObj?.size ?? 0;
        if (size > maxSizeBytes) {
          if (now - lastSizeWarningTime.current > 1000) {
            openNotificationWithIcon({
              type: "warning",
              message: `Algunos archivos superan los ${maxSizeMB}MB y no se agregaron.`,
            });
            lastSizeWarningTime.current = now;
          }
          return;
        }
        validSizeFiles.push(file);
      });

      if (validSizeFiles.length > availableSlots) {
        if (now - lastCountWarningTime.current > 1000) {
          openNotificationWithIcon({
            type: "warning",
            message: `Solo puedes agregar ${availableSlots} imagen(es) más.`,
          });
          lastCountWarningTime.current = now;
        }
      }

      setFileList(validSizeFiles.slice(0, availableSlots));
    },
    [availableSlots, maxImages, maxSizeMB, maxSizeBytes, openNotificationWithIcon]
  );

  const handleSave = useCallback(async () => {
    if (selectedFiles.length === 0) {
      openNotificationWithIcon({
        type: "warning",
        message: "Seleccione al menos una imagen",
      });
      return;
    }

    try {
      setLoading(true);
      const compressed = await Promise.all(
        selectedFiles.map((file) => {
          const originalType = file.type;
          const mimeType = ["image/jpeg", "image/webp", "image/png"].includes(originalType)
            ? (originalType as "image/jpeg" | "image/webp" | "image/png")
            : "image/jpeg";

          return compressImage(file, {
            maxWidth: 1080,
            maxHeight: 1080,
            quality: 0.75,
            mimeType,
          });
        })
      );
      onSaveSuccess(compressed);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "No se pudo cargar la imagen";
      openNotificationWithIcon({
        type: "error",
        message: "Error al guardar imagen",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, [onSaveSuccess, openNotificationWithIcon, selectedFiles]);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  const handleRemoveSelectedFile = useCallback((uid: string) => {
    setFileList((prev) => prev.filter((current) => current.uid !== uid));
  }, []);

  return (
    <div className="flex w-full max-w-3xl flex-col gap-3 p-1">
      <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600">
        Máximo {maxImages} imágenes. Disponibles: {availableSlots}. Tamaño máximo por archivo: {maxSizeMB}MB.
      </div>

      <div
        onClick={() => {
          if (availableSlots > 0 && !loading && !openingExplorer) {
            setOpeningExplorer(true);
            setTimeout(() => setOpeningExplorer(false), 1000);
          }
        }}
      >
        <Upload.Dragger
          multiple
          fileList={fileList}
          beforeUpload={handleBeforeUpload}
          onChange={handleChangeUpload}
          accept={acceptedFormats}
          showUploadList={false}
          disabled={loading || availableSlots <= 0 || openingExplorer}
          className="!bg-white"
        >
          <div className="py-5 text-center">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
              <PlusOutlined />
            </div>
            <p className="text-sm font-medium text-gray-700">
              {availableSlots > 0 ? "Arrastra tus imágenes aquí o haz clic para buscar" : "Límite de imágenes alcanzado"}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Máximo {maxSizeMB}MB por archivo
            </p>
          </div>
        </Upload.Dragger>
      </div>

      <div className="rounded-md border border-gray-200 bg-gray-50 p-2">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">Archivos seleccionados</div>
        <div className="max-h-56 overflow-y-auto pr-1">
          {fileList.length === 0 ? (
            <div className="rounded-md bg-white px-3 py-4 text-center text-xs text-gray-500">No hay archivos seleccionados.</div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {fileList.map((file) => {
                const previewUrl = file.thumbUrl || (file.originFileObj ? URL.createObjectURL(file.originFileObj) : "");
                return (
                  <div key={file.uid} className="flex items-center justify-between gap-2 rounded-md bg-white px-2 py-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="h-12 w-12 overflow-hidden rounded-md bg-gray-100">
                        {previewUrl ? (
                          <Image
                            src={previewUrl}
                            alt={file.name}
                            width="100%"
                            height="100%"
                            className="!h-12 !w-12 object-cover"
                            preview={false}
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center text-[10px] text-gray-400">Sin vista</div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-medium text-gray-700">{file.name}</div>
                        <div className="text-[11px] text-gray-500">{((file.size ?? 0) / (1024 * 1024)).toFixed(2)} MB</div>
                      </div>
                    </div>
                    <Button
                      type="secondary"
                      size="small"
                      label={<CloseOutlined />}
                      onClick={() => handleRemoveSelectedFile(file.uid)}
                      disabled={loading}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="secondary"
          onClick={handleCancel}
          disabled={loading}
          label={
            <div className="flex items-center gap-2">
              <CloseOutlined /> Cancelar
            </div>
          }
        />
        <Button
          type="primary"
          onClick={() => void handleSave()}
          disabled={loading || selectedFiles.length === 0}
          loading={loading}
          label={
            <div className="flex items-center gap-2">
              <SaveOutlined /> Procesar imágenes
            </div>
          }
        />
      </div>
    </div>
  );
};
