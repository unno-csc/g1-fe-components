import { LOCATION_DEFAULT } from '@/constants';
import { EMapZoom } from '@/enums';
import {
	IAddressData,
	IMapLocation,
	IMapSelection,
	IMapSelectionDetails,
	IMapSelectionPlaceObject,
} from '@/interfaces';
import { GOOGLE_API_KEY, GOOGLE_MAP_ADDRESS_KEYS, GOOGLE_MAP_ID } from '@/utils/constants';
import { APIProvider, Map as MapComponent, MapMouseEvent, Marker } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { InputSearchAddress } from './components/InputSearchAddress';

export interface IMapProps {
	location?: IMapLocation;
	googleMapsApiKey?: string;
    zoom?: EMapZoom;
    mapId?: string;
	onLocationChange?: (mapPoint: IMapSelection | null) => void;
}

export const Map = ({
	location = LOCATION_DEFAULT,
	googleMapsApiKey = GOOGLE_API_KEY,
	zoom = EMapZoom.zoom14,
	mapId = GOOGLE_MAP_ID,
	onLocationChange,
}: IMapProps) => {
	const [center, setCenter] = useState<IMapLocation>(location);
	const [markerPosition, setMarkerPosition] = useState<IMapLocation>(location);
	const [isMapReady, setIsMapReady] = useState(false);

	useEffect(() => {
		setCenter(location);
		setMarkerPosition(location);
		// Emitir cambio si el prop location cambia externamente y el mapa está listo
		if (isMapReady && typeof location.lat === 'number' && typeof location.lng === 'number') {
			void reverseGeocode(location.lat, location.lng);
		}
	}, [location, isMapReady]);

	useEffect(() => {
		const checkGoogleReady = () => {
			const g = (window as any)?.google;
			if (g?.maps?.Geocoder) {
				setIsMapReady(true);
				return true;
			}
			return false;
		};

		if (checkGoogleReady()) return;

		let timeoutId: number;
		const intervalId = window.setInterval(() => {
			if (checkGoogleReady()) {
				window.clearInterval(intervalId);
				window.clearTimeout(timeoutId);
			}
		}, 200);

		timeoutId = window.setTimeout(() => {
			window.clearInterval(intervalId);
		}, 10000);

		return () => {
			window.clearInterval(intervalId);
			window.clearTimeout(timeoutId);
		};
	}, []);

	const getLongName = (value: unknown): string | undefined => {
		if (typeof value === 'object' && value !== null && 'long_name' in value) {
			return (value as { long_name: string }).long_name;
		}
		return undefined;
	};

	// Extrae primaria/secundaria separando por " y " o "&" (primer ocurrencia)
	const splitStreet = (street?: string) => {
		if (!street) return null;
		const match = street.match(/^(.*?)\s*(?:&|y)\s*(.+)$/i);
		if (match && match[1] && match[2]) {
			return {
				primary: match[1].trim(),
				secondary: match[2].trim(),
			};
		}
		return null;
	};

	const normalizePlaceObject = (placeObject: Record<string, unknown>) => {
		const clone = { ...(placeObject ?? {}) };
		// Si sólo existe intersection, úsalo también como route
		if (!clone[GOOGLE_MAP_ADDRESS_KEYS.route] && clone[GOOGLE_MAP_ADDRESS_KEYS.intersection]) {
			clone[GOOGLE_MAP_ADDRESS_KEYS.route] = clone[GOOGLE_MAP_ADDRESS_KEYS.intersection];
		}
		// Si sólo existe route, úsalo también como intersection para mantener consistencia
		if (!clone[GOOGLE_MAP_ADDRESS_KEYS.intersection] && clone[GOOGLE_MAP_ADDRESS_KEYS.route]) {
			clone[GOOGLE_MAP_ADDRESS_KEYS.intersection] = clone[GOOGLE_MAP_ADDRESS_KEYS.route];
		}
		return clone;
	};

	const buildAddressDetails = (placeObject: Record<string, unknown>, lat: number, lng: number) => {
		const normalized = normalizePlaceObject(placeObject);

		const streetNumberRaw = getLongName(normalized[GOOGLE_MAP_ADDRESS_KEYS.streetNumber]) || '';
		const streetNumber = streetNumberRaw && streetNumberRaw.trim() !== '&' ? streetNumberRaw : '';
		let principalStreet =
			getLongName(normalized[GOOGLE_MAP_ADDRESS_KEYS.route]) ||
			getLongName(normalized[GOOGLE_MAP_ADDRESS_KEYS.intersection]) ||
			'';
		let secondaryStreet = getLongName(normalized[GOOGLE_MAP_ADDRESS_KEYS.intersection]) || '';

		// Si no vino secundaria, o es igual a la primaria, la derivamos de la primaria usando conectores
		if ((!secondaryStreet || secondaryStreet === principalStreet) && principalStreet) {
			const split = splitStreet(principalStreet);
			if (split) {
				principalStreet = split.primary;
				secondaryStreet = split.secondary;
			}
		}
		// Si siguen iguales, mejor dejar secundaria vacía para evitar duplicados
		if (secondaryStreet === principalStreet) {
			secondaryStreet = '';
		}

		const postalCode = getLongName(placeObject[GOOGLE_MAP_ADDRESS_KEYS.postalCode]) || '';
		const province = getLongName(normalized[GOOGLE_MAP_ADDRESS_KEYS.province]) || '';
		const canton = getLongName(normalized[GOOGLE_MAP_ADDRESS_KEYS.canton]) || '';
		const parish = getLongName(normalized[GOOGLE_MAP_ADDRESS_KEYS.parish]) || '';
		const country = getLongName(normalized.country) || '';

		const addressParts = [principalStreet, streetNumber, canton, province, country].filter(Boolean);
		const addressSummary = addressParts.length > 0 ? addressParts.join(', ') : `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

		return {
			details: { principalStreet, secondaryStreet, streetNumber, postalCode, province, canton, parish, country },
			addressSummary,
		};
	};

	const emitLocationChange = (payload?: IMapSelection) => {
		onLocationChange?.(payload ?? null);
	};

	const reverseGeocode = async (lat: number, lng: number) => {
		const g = (window as any)?.google;
		if (!g?.maps?.Geocoder) {
			console.info('Mapa todavía no listo para geocoding inverso');
			return;
		}
		const geocoder = new g.maps.Geocoder();
		try {
			const response = await geocoder.geocode({ location: { lat, lng } });
			const result = response?.results?.[0];
			if (!result) {
				console.log('Sin resultados de geocoding inverso. Coordenadas:', { lat, lng });
				return;
			}

			const placeObject: Record<string, unknown> = {};
			result.address_components?.forEach((item: any) => {
				const type = item.types?.[0];
				if (type) {
					placeObject[type] = {
						long_name: item.long_name,
						short_name: item.short_name,
					};
				}
			});

			placeObject.lat = lat;
			placeObject.long = lng;

			const normalizedPlaceObject = normalizePlaceObject(placeObject);

			const { details, addressSummary } = buildAddressDetails(normalizedPlaceObject, lat, lng);
			const addressData: IAddressData = {
				principalStreet: details.principalStreet,
				latitude: lat,
				longitude: lng,
				streetNumber: details.streetNumber,
				postalCode: details.postalCode,
				isManualAddress: false,
			};

			emitLocationChange({
				lat,
				lng,
				address: addressSummary,
				details: details as IMapSelectionDetails,
				placeObject: normalizedPlaceObject as IMapSelectionPlaceObject,
				addressData,
			});

			
		} catch (error) {
			console.warn('Error al hacer geocoding inverso', error);
			console.log('Coordenadas seleccionadas (con error):', { lat, lng });
		}
	};

	const onClick = (event: MapMouseEvent) => {
		const latLng = event.detail.latLng;
		if (!latLng) return;

		const latValue = typeof latLng.lat === 'function' ? latLng.lat() : latLng.lat;
		const lngValue = typeof latLng.lng === 'function' ? latLng.lng() : latLng.lng;
		if (latValue == null || lngValue == null) return;

		const nextPosition = { lat: latValue, lng: lngValue };
		setCenter(nextPosition);
		setMarkerPosition(nextPosition);

		void reverseGeocode(latValue, lngValue);
	};

	const onCameraChanged = (ev: any) => {
		const centerAny = ev?.detail?.center;
		if (!centerAny) return;
		const lat = typeof centerAny.lat === 'function' ? centerAny.lat() : centerAny.lat;
		const lng = typeof centerAny.lng === 'function' ? centerAny.lng() : centerAny.lng;
		if (typeof lat === 'number' && typeof lng === 'number') {
			setCenter({ lat, lng });
		}
	};

    const handleLocationChangeBySearch = (placeObject?: any, addressData?: any) => {
        const lat = typeof placeObject?.lat === 'number' ? placeObject.lat : addressData?.latitude;
        const lng = typeof placeObject?.long === 'number' ? placeObject.long : addressData?.longitude;

        if (typeof lat === 'number' && typeof lng === 'number') {
            const normalizedPlaceObject = normalizePlaceObject({ ...(placeObject ?? {}), lat, long: lng });
            const { details, addressSummary } = buildAddressDetails(normalizedPlaceObject, lat, lng);

            const nextPosition = { lat, lng };
            setCenter(nextPosition);
            setMarkerPosition(nextPosition);

			const normalizedAddressData: IAddressData = {
				principalStreet: details.principalStreet,
				latitude: lat,
				longitude: lng,
				streetNumber: details.streetNumber,
				postalCode: details.postalCode,
				isManualAddress: false,
			};
			emitLocationChange({
				lat,
				lng,
				address: addressSummary,
				details: details as IMapSelectionDetails,
				placeObject: normalizedPlaceObject as IMapSelectionPlaceObject,
				addressData: normalizedAddressData,
			});
        } else {
            console.log('Búsqueda -> ubicación sin coordenadas claras:', { placeObject, addressData });
			emitLocationChange();
        }
    };
	return (
		<div className="relative flex-1 bg-red-300 h-full w-full">
			{!isMapReady && (
				<div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 text-gray-700 text-sm">
					Cargando mapa...
				</div>
			)}
			<APIProvider apiKey={googleMapsApiKey} libraries={['places']}>
				<MapComponent
					style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
					defaultCenter={center}
					center={center}
					defaultZoom={zoom}
					gestureHandling="greedy"
					disableDefaultUI
					onClick={onClick}
					onCameraChanged={onCameraChanged}
					mapId={mapId}
				>
					{markerPosition && <Marker position={markerPosition} />}
				</MapComponent>
				<InputSearchAddress
					floatingInputPlaceholder={'Buscar ubicación'}
					googleMapsApiKey={googleMapsApiKey}
					onLocationChange={handleLocationChangeBySearch}
				/>
			</APIProvider>
		</div>
	);
};
