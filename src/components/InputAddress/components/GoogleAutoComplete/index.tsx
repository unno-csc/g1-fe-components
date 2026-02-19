import { GOOGLE_API_KEY, GOOGLE_MAP_ADDRESS_KEYS } from '@/utils/constants';
import { Loader } from '@googlemaps/js-api-loader';
import { useEffect, useRef, useState } from 'react';
import { IInputAddressProps } from '../..';
import { Input as AntInput } from 'antd';
import { RefCallBack } from 'react-hook-form';
import { Button } from '@/components/Button';
import { FormLabel } from '@/components/FormLabel';
import { FormLabelError } from '@/components/FormLabelError';
import { Button as AntButton } from 'antd';
import { Pin2Icon } from '@/assets/icons';

interface GoogleRef {
	[x: string]: any;
	current?: {
		maps?: any;
	};
}

export const getLongName = (value: unknown): string | undefined => {
	if (typeof value === 'object' && value !== null && 'long_name' in value) {
		return (value as { long_name: string }).long_name;
	}
	return undefined;
};

export const GoogleAutoComplete = (props: IInputAddressProps['googleAutoCompleteProps']) => {
	const {
		name,
		label,
		googleMapsApiKey = GOOGLE_API_KEY,
		error,
		watch,
		setValue,
		onLocationChange,
		setShowManualEntry,
		onMapClick,
	} = props;

	const autoCompleteRef = useRef<any>();
	const inputRef = useRef<any>(null);
	const googleRef = useRef<GoogleRef>();

	const { address } = watch();
	// const address = ''; // TODO : remove

	const [isGoogleLoading, setIsGoogleLoading] = useState(true);

	const options = {
		componentRestrictions: { country: 'EC' },
	};

	//NOTE: If google maps doesn't recognize an address, it will still let the user input and select it but won't return all the required fields, this is a check for that.
	const checkAddressComponents = (addressComponents: any) => {
		console.log('addressComponents', addressComponents);
		if (!addressComponents) return false;

		const province = addressComponents[GOOGLE_MAP_ADDRESS_KEYS.province];
		const canton = addressComponents[GOOGLE_MAP_ADDRESS_KEYS.canton];
		const route = addressComponents[GOOGLE_MAP_ADDRESS_KEYS.route];
		const intersection = addressComponents[GOOGLE_MAP_ADDRESS_KEYS.intersection];

		const hasRequired = !!province && !!canton && (!!route || !!intersection);

		if (!hasRequired) {
			setShowManualEntry(true);
			console.log('showManualEntry si', true);
			return true;
		}
		console.log('showManualEntry no', false);
		return false;
	};

	useEffect(() => {
		const loader = new Loader({
			apiKey: googleMapsApiKey,
			libraries: ['geocoding', 'places'],
		});
		loader.load().then((google: any) => {
			googleRef.current = google;
			setIsGoogleLoading(false);
		});
		setValue('isManualAddress', false);
	}, []);

	function hasMaps(obj: any): obj is { maps: any } {
		return !!obj && typeof obj.maps !== 'undefined';
	}

	useEffect(() => {
		if (!isGoogleLoading && hasMaps(googleRef?.current)) {
			// Acceder al elemento HTML real del input de Ant Design
			const inputElement = inputRef.current?.input || inputRef.current;
			autoCompleteRef.current = new googleRef.current.maps.places.Autocomplete(inputElement, options);

			autoCompleteRef?.current?.addListener('place_changed', async () => {
				const place = await autoCompleteRef?.current?.getPlace();

				const placeObject: {
					[key: string]:
						| {
								long_name: string;
								short_name: string;
						  }
						| number
						| undefined;
				} = {};

				const location = place?.geometry?.location;
				const lat = location?.lat();
				const long = location?.lng();

				place?.address_components?.forEach((item: any) => {
					const type = item.types[0];
					placeObject[type] = {
						long_name: item.long_name,
						short_name: item.short_name,
					};
				});
				placeObject.lat = lat;
				placeObject.long = long;

				const hasError = checkAddressComponents(placeObject);
				if (hasError) {
					onLocationChange(null);
					setValue('address', '');
				} else {
					const addressData = {
						principalStreet:
							getLongName(placeObject[GOOGLE_MAP_ADDRESS_KEYS.route]) ||
							getLongName(placeObject[GOOGLE_MAP_ADDRESS_KEYS.intersection]) ||
							'',
						latitude: placeObject[GOOGLE_MAP_ADDRESS_KEYS.lat] as number,
						longitude: placeObject[GOOGLE_MAP_ADDRESS_KEYS.long] as number,
						streetNumber: getLongName(placeObject[GOOGLE_MAP_ADDRESS_KEYS.streetNumber]) || '',
						postalCode: getLongName(placeObject[GOOGLE_MAP_ADDRESS_KEYS.postalCode]) || '',
						isManualAddress: false,
					};

					onLocationChange(placeObject);
					setValue('address', addressData);
					setValue('addressprovince', getLongName(placeObject[GOOGLE_MAP_ADDRESS_KEYS.province]));
					setValue('addresscanton', getLongName(placeObject[GOOGLE_MAP_ADDRESS_KEYS.canton]));
					setValue('addressparish', getLongName(placeObject[GOOGLE_MAP_ADDRESS_KEYS.parish]));
					setValue('isManualAddress', false);

					// Llamar a setAddressObject para notificar al componente padre
					//setAddressObject?.(addressData);
				}
			});
		}
	}, [isGoogleLoading]);

	return (
		<div>
			<div className="relative">
				<FormLabel label={label} />
				<div className="flex felx-row items-center justify-between">
					<div className="w-full">
						<AntInput
							type="text"
							name={name}
							placeholder=" "
							value={address?.principalStreet}
							ref={inputRef as unknown as RefCallBack}
							onChange={e => {
								setValue('address', e?.target?.value);
							}}
							status={error ? 'error' : undefined}
							className="!h-8 !w-full !border-r-0 !rounded-tr-none !rounded-br-none"
						/>
					</div>
					<div className="w-auto">
						<AntButton
							type="default"
							onClick={() => {
								onMapClick?.();
							}}
							className="itsa-map-button group !h-8 !w-atuo !border-tl-0 !rounded-tl-none !rounded-bl-none"
						>
							<Pin2Icon className="itsa-map-button__icon w-4 h-4 font-bold" />
							<small className="itsa-map-button__text text-xs font-bold">Mapa</small>
						</AntButton>
					</div>
				</div>

				{error && !address && <FormLabelError label={error} />}
			</div>
			<div className="flex items-end justify-between mt-2">
				<div className="flex items-center justify-end mb-1 w-full">
					<span className="text-black-100 text-sm mr-1">¿No se puede encontrar la dirección?</span>
					<Button
						onClick={() => {
							setShowManualEntry(true);
							onLocationChange(null);
							setValue('address', '');
						}}
						label="click aqui"
					/>
				</div>
			</div>
		</div>
	);
};
