import { Control, useFieldArray } from "react-hook-form";
import { MdDelete, MdLocationOn } from "react-icons/md";
import { useState } from "react";
import { PropertiesFormType } from "./PropertiesForm";
import SelectField from "@/components/shared/forms/SelectField";
import TextInput from "@/components/shared/forms/TextInput";
import { useTranslations } from "next-intl";

export function NearbySection({
    control,

}: {
    control: Control<PropertiesFormType>;
}) {
    const t = useTranslations("dashboard.properties.form");
    const tCategories = useTranslations('property.filter');

    const { fields, append, remove } = useFieldArray({
        control,
        name: "nearby",
    });

    // Local state for the "new" entry inputs
    const [newPlace, setNewPlace] = useState({
        category: "",
        name: "",
        distance: "",
    });

    const handleAdd = () => {
        console.log(newPlace.category, newPlace.name, newPlace.distance)
        if (!newPlace.category || !newPlace.name || !newPlace.distance) return;

        append({
            category: newPlace.category,
            name: newPlace.name,
            distance: Number(newPlace.distance),
        });

        // reset local state
        setNewPlace({ category: "education", name: "", distance: "" });
    };

    return (
        <div className="my-8 space-y-4">
            <h3 className="text-dark font-bold text-[20px] md:text-[22px] leading-[24px]">
                {t("nearby")}
            </h3>

            {/* Show added places */}
            <div className="space-y-2">
                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="flex flex-wrap justify-between md:grid md:grid-cols-13 gap-4 border-b border-gray-200 pb-2"
                    >
                        <p className="md:col-span-4 text-dark font-medium text-lg leading-[24px]">
                            {tCategories("categories.options", { option: field.category }) || "—"}
                        </p>
                        <p className="md:col-span-4 text-dark text-lg leading-[24px]">{field.name || "—"}</p>
                        <div className="md:col-span-4 flex items-center gap-2">
                            <MdLocationOn size={24} className="shrink-0 text-secondary" />
                            <p className="text-dark text-lg leading-[24px]">
                                {field.distance ? `${field.distance} ${t("distanceUnit")}` : "—"}
                            </p>
                        </div>
                        <button type="button" onClick={() => remove(index)} className="md:col-span-1">
                            <MdDelete size={24} className="shrink-0 text-red-600 md:ms-auto" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Inputs for adding a new place */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <SelectField
                    label={t("placeName")}
                    options={[
                        { label: tCategories("categories.options", { option: "education" }), value: "education" },
                        { label: tCategories("categories.options", { option: "hospital" }), value: "hospital" },
                        { label: tCategories("categories.options", { option: "shopping" }), value: "shopping" }
                    ]}
                    placeholder={t("categoryPlaceholder")}
                    value={
                        newPlace.category
                            ? {
                                label: tCategories("categories.options", { option: newPlace.category }),
                                value: newPlace.category,
                            }
                            : null
                    }

                    onChange={(opt) => setNewPlace((prev) => ({ ...prev, category: opt.value }))}
                />
                <TextInput
                    label={t("distance")}
                    placeholder={t("placeNamePlaceholder")}
                    type="text"
                    value={newPlace.name}
                    onChange={(e) => setNewPlace((prev) => ({ ...prev, name: e.target.value }))}
                />
                <TextInput
                    label={t("distance")}
                    placeholder={t("distancePlaceholder")}
                    type="number"
                    value={newPlace.distance}
                    onChange={(e) => setNewPlace((prev) => ({ ...prev, distance: e.target.value }))}
                />
            </div>

            <button
                type="button"
                className="text-primary font-medium"
                onClick={handleAdd}
            >
                {t("addNearby")}
            </button>
        </div>
    );
}
