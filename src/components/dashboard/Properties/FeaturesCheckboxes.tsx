import { Control, Controller } from "react-hook-form";
import { PropertiesFormType } from "./PropertiesForm";
import { useTranslations } from "next-intl";
import { featureKeys } from "@/constants/properties/constant";
import { FeatureType } from "@/types/dashboard/properties";

export function FeaturesCheckboxes({
    control,
    name,
}: {
    control: Control<PropertiesFormType>;
    name: "features";
}) {
    const t = useTranslations("property.filter.features");


    return (
        <div className="space-y-4 my-8">
            <h3 className="text-dark font-bold text-[20px] md:text-[22px] leading-[24px]">
                {t("title")}
            </h3>

            <Controller
                control={control}
                name={name}
                render={({ field }) => {
                    const { value = [], onChange } = field;
                    const toggle = (feature: FeatureType) => {
                        if (value.includes(feature)) {
                            onChange(value.filter((f: string) => f !== feature));
                        } else {
                            onChange([...value, feature]);
                        }
                    };

                    return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-5 gap-x-6">
                            {featureKeys.map((key) => (
                                <label
                                    key={key}
                                    className="flex items-center gap-2 cursor-pointer text-lg font-medium leading-[20px] text-dark"
                                >
                                    <input
                                        type="checkbox"
                                        checked={value.includes(key)}
                                        onChange={() => toggle(key)}
                                        className="w-4 h-4 accent-primary border border-gray-300 rounded-sm"
                                    />

                                    {t("options", { option: key })}
                                </label>
                            ))}
                        </div>
                    );
                }}
            />
        </div>
    );
}