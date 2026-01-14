import { Controller, useFieldArray } from "react-hook-form";
import { MdAdd, MdDelete } from "react-icons/md";
import TextInput from "@/components/shared/forms/TextInput";
import { useTranslations } from "next-intl";
import FormErrorMessage from "@/components/shared/forms/FormErrorMessage";


const NearbyFacilitiesSection = ({ control, name, label, errors }: { control: any, name: string, label: string, errors: any }) => {
    const t = useTranslations("dashboard.properties.form");
    const { fields, append, remove } = useFieldArray({
        control,
        name: name
    });
    const getFieldError = (index: number, field: string) => {
        return errors?.[name]?.[index]?.[field]?.message;
    };
    return (
        <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">{label}</h4>
            {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start border p-2 rounded-md bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1">
                        <div className="flex flex-col">

                            <Controller
                                control={control}
                                name={`${name}.${index}.name`}
                                render={({ field }) => <TextInput {...field} placeholder={t("facilityName")} label={t("facilityName")} className="!mb-0" />}
                            />
                            {getFieldError(index, 'name') && (
                                <FormErrorMessage message={getFieldError(index, 'name')} />
                            )}
                        </div>
                        <div className="flex flex-col">

                            <Controller
                                control={control}
                                name={`${name}.${index}.distance_km`}
                                render={({ field }) => <TextInput type="number" {...field} placeholder={t("distanceKm")} label={t("distanceKm")} className="!mb-0" />}
                            />
                            {getFieldError(index, 'distance_km') && (
                                <FormErrorMessage message={getFieldError(index, 'distance_km')} />
                            )}
                        </div>
                    </div>
                    <button type="button" onClick={() => remove(index)} className="text-red-500 p-2 hover:bg-red-50 rounded">
                        <MdDelete size={20} />
                    </button>
                </div>
            ))}
            {fields.length < 8 && (
                <button
                    type="button"
                    onClick={() => append({ name: "", type: "", distance_km: 0 })}
                    className="flex items-center gap-1 text-sm text-secondary font-medium hover:underline"
                >
                    <MdAdd /> {t("addFacility")}
                </button>
            )}
        </div>
    );
};

export default NearbyFacilitiesSection;