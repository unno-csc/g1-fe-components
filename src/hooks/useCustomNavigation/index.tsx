import { useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { ELocalStorageKeys, EMicroFrontends } from "@/enums";
import { securityApi } from "@/helpers/configAxios";
import { API_VERSIONS_MODULE } from "@/constants";
import { getNumberFromStorage } from "@/helpers/formats";
import { getMicroFrontendByPath, joinUrl } from "@/helpers/strings";
import { IValidateRouteResponse } from "@/interfaces";

export interface IUseCustomNavigationProps {
  path: string;
}

type NavigateFn = (to: string, opts?: { replace?: boolean }) => void;

// Mapeo directo de slugs a URLs de microfrontends
const MICRO_URL_MAP = {
  "itsa-backoffice": EMicroFrontends.itsaBackOffice,
  "itsa-frontoffice": EMicroFrontends.itsaFrontoffice,
} as const;

type MicroSlug = keyof typeof MICRO_URL_MAP;

export const useCustomNavigation = () => {
  const [isLoading, setIsLoading] = useState(false);
  // Cuando se debe navegar dentro del mismo SPA, guardamos el destino aquí
  const [pendingTo, setPendingTo] = useState<string | null>(null);
  // En SSR (o entornos sin window), dejamos aquí el href externo
  const [externalHref, setExternalHref] = useState<string | null>(null);

  const resetInstruction = useCallback(() => {
    setPendingTo(null);
    setExternalHref(null);
  }, []);

  const navigateToMicroFrontend = useCallback(
    (path: string, navigate?: NavigateFn) => {
      const normalized = (path ?? "").replace(/^\/+|\/+$/g, "");
      const withSlash = `/${normalized}`;

      const targetMicro = getMicroFrontendByPath(withSlash) as MicroSlug | null;
      const currentMicro = (typeof window !== "undefined"
        ? (localStorage.getItem(ELocalStorageKeys.currentEnvironment) || null)
        : null) as MicroSlug | null;

      // Si no se identifica micro o es el mismo, navega en el SPA
      if (!targetMicro || currentMicro === targetMicro) {
        if (navigate) {
          navigate(withSlash);
        } else {
          setPendingTo(withSlash); // el componente puede renderizar <Navigate />
        }
        return;
      }

      // Otro micro → redirect completo
      const base = MICRO_URL_MAP[targetMicro];
      const full = joinUrl(base, withSlash);

      if (typeof window !== "undefined") {
        window.location.href = full;
      } else {
        setExternalHref(full);
      }
    },
    []
  );

  const navigateRoute = useCallback(
    async (
      { path }: IUseCustomNavigationProps,
      navigate?: NavigateFn
    ): Promise<boolean> => {
      try {
        const normalized = path?.trim();
        if (!normalized || normalized === "/" || normalized === "/home") {
          if (navigate) navigate("/home", { replace: true });
          else setPendingTo("/home");
          return true;
        }

        setIsLoading(true);
        const agencyId =
          getNumberFromStorage(ELocalStorageKeys.agencyId) ||
          getNumberFromStorage(ELocalStorageKeys.agency);

        const { data } = await securityApi.get<IValidateRouteResponse>(
          API_VERSIONS_MODULE.security + "validate-route/",
          { params: { path: normalized, agency_id: agencyId } }
        );

        const ok = data?.code === 1 && !!data?.result;
        if (ok) {
          resetInstruction();
          navigateToMicroFrontend(normalized, navigate);
          return true;
        }
        return false;
      } catch {
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [navigateToMicroFrontend, resetInstruction]
  );

  return { navigateRoute, isLoading, pendingTo, externalHref, resetInstruction };
};

// (Opcional) Helper para usar <Navigate/> sin repetir lógica.
// Úsalo SOLO donde exista un <Router>.
export const CustomNavigate: React.FC<{ to?: string | null; replace?: boolean }> = ({
  to,
  replace,
}) => {
  if (!to) return null;
  return <Navigate to={to} replace={replace} />;
};
