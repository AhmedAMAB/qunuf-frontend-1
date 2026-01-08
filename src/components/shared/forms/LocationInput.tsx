'use client';

import { useLocale, useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { ReactElement, useEffect, useState } from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';

const LocationMap = dynamic(() => import('../../shared/LocationMap'), {
    ssr: false,
});



async function reverseGeocode(
    lat: number,
    lng: number,
    t: ReturnType<typeof useTranslations>,
    signal?: AbortSignal,
    locale?: "ar" | 'en'
): Promise<string> {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=${locale ?? 'ar'}`;
        const res = await fetch(url, {
            signal,
            headers: {
                'User-Agent': 'YourAppName/1.0 (your-email@example.com)',
            },
        });
        if (!res.ok) throw new Error('Reverse geocoding failed');
        const data = await res.json();
        return data.display_name || t("unknownAddress");
    } catch (e: any) {
        if (e?.name === 'AbortError') throw e;
        return t("addressFetchError");
    }
}

type LocationInputProps<T extends FieldValues> = {
    control: Control<T>;
    name: Path<T>; // this ensures the name is a valid path
    showAddress?: boolean;
};

export type LocationInputType = <T extends FieldValues>(
    props: LocationInputProps<T>
) => ReactElement;

function LocationInput<T extends FieldValues>({ control, name, showAddress = true }: LocationInputProps<T>) {
    const {
        field: { value: position, onChange },
    } = useController({
        name,
        control,
    });
    const t = useTranslations("comman.form.locationInput");
    const locale = useLocale();
    // Position state
    const [address, setAddress] = useState<string>(t("fetching"));
    const [loadingAddress, setLoadingAddress] = useState<boolean>(false);
    // Text inputs (editable)
    const [latInput, setLatInput] = useState(position.lat.toFixed(6));
    const [lngInput, setLngInput] = useState(position.lng.toFixed(6));
    const [error, setError] = useState<string>('');


    // Sync text inputs when position changes (e.g., map click)
    useEffect(() => {
        setLatInput(position.lat.toFixed(6));
        setLngInput(position.lng.toFixed(6));
    }, [position]);

    // Fetch address when position changes — race-safe
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        if (!showAddress) return;
        const fetchAddress = async () => {
            try {
                setLoadingAddress(true);
                const addr = await reverseGeocode(position.lat, position.lng, t, controller.signal, locale as 'ar' | 'en');
                if (!isMounted) return; // component unmounted
                setAddress(addr);
            } catch (err) {
                if (!isMounted) return;
                // Ignore abort errors; handle real errors gracefully
                setAddress(t("fetching"));
            } finally {
                if (isMounted) setLoadingAddress(false);
            }
        };

        fetchAddress();

        return () => {
            isMounted = false;
            controller.abort(); // cancel any in-flight request
        };
    }, [position, locale, showAddress]);


    // Validate and apply changes when either input updates
    const applyFromInputs = (latStr: string, lngStr: string) => {
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);

        if (Number.isFinite(lat) && Number.isFinite(lng)) {
            if (lat < -90 || lat > 90) {
                setError(t("latRangeError"));
                return;
            }
            if (lng < -180 || lng > 180) {
                setError(t("lngRangeError"));
                return;
            }
            setError('');
            onChange({ lat, lng });
        } else {
            setError(t("invalidInput"));
        }
    };

    return (
        <div className="space-y-4">
            {/* Address and inputs */}
            {showAddress && <div className="text-lg font-semibold text-gray-600 mt-2 md:mt-0">
                {loadingAddress ? t("fetching") : `${t("addressPrefix")} ${address}`}
            </div>}
            <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
                {/* Selected position summary */}
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700">{t("selectedLocation")}</label>
                    <span className="text-sm text-gray-700">
                        {t("latitude")}: {position.lat.toFixed(6)} — {t("longitude")}: {position.lng.toFixed(6)}
                    </span>
                </div>

                {/* Inputs with labels + helper + hover tooltip */}
                <div className="flex gap-3 w-full md:w-auto">
                    {/* Latitude */}
                    <div className="flex-1">
                        <label htmlFor="lat" className="block text-xs font-medium text-gray-600 mb-1">
                            <span className='text-nowrap'>  {t("latitude")}</span>
                            <span className="ml-1 inline-block align-middle group relative cursor-help">
                                <svg className="w-3 h-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zM9 9h2v6H9V9zm0-4h2v2H9V5z" />
                                </svg>
                            </span>
                        </label>
                        <input
                            id="lat"
                            type="number"
                            step="0.000001"
                            min={-90}
                            max={90}
                            inputMode="decimal"
                            placeholder={t("latitudePlaceholder", { lat: latInput })}
                            value={latInput}
                            onChange={(e) => {
                                const val = e.target.value;
                                setLatInput(val);
                                applyFromInputs(val, lngInput);
                            }}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                    </div>

                    {/* Longitude */}
                    <div className="flex-1">
                        <label htmlFor="lng" className="flex gap-1block text-xs font-medium text-gray-600 mb-1">
                            <span className='text-nowrap'>  {t("longitude")}</span>

                            <span className="ml-1 inline-block align-middle group relative cursor-help">
                                <svg className="w-3 h-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zM9 9h2v6H9V9zm0-4h2v2H9V5z" />
                                </svg>
                            </span>
                        </label>
                        <input
                            id="lng"
                            type="number"
                            step="0.000001"
                            min={-180}
                            max={180}
                            inputMode="decimal"
                            placeholder={t("longitudePlaceholder", { lng: lngInput })}
                            value={lngInput}
                            onChange={(e) => {
                                const val = e.target.value;
                                setLngInput(val);
                                applyFromInputs(latInput, val);
                            }}
                            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                    </div>
                </div>
            </div>


            {error && <div className="text-xs text-red-600">{error}</div>}

            <LocationMap
                lat={position.lat}
                lng={position.lng}
                onChange={(coords) => onChange(coords)}
            />

        </div>
    );
}

export default LocationInput;
