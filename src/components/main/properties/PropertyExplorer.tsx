import { getLocale, getTranslations } from "next-intl/server";
import FilterProperties from "./FilterProperties";
import PropertiesList from "./PropertiesList";
import { Locale } from "@/types/global";


export default async function PropertyExplorer() {
    const locale = await getLocale();
    const t = await getTranslations('property.filter')

    return (
        <div className="mt-28 mx-2">
            <div className="container ">
                <div className="flex flex-col gap-4 md:gap-6 mb-10 lg:grid lg:grid-cols-[335px_1fr]">
                    <div className="z-[45] relative max-sm:w-full max-sm:max-w-[416px] max-sm:mx-auto flex justify-between lg:block">
                        <FilterProperties />
                        <h1 className="block lg:hidden text-2xl md:text-4xl text-dark font-bold">
                            {t("header")}
                        </h1>
                    </div>
                    <div className="flex-2">
                        <h1 className="hidden lg:block pb-4 text-3xl md:text-4xl text-dark font-bold">
                            {t("header")}
                        </h1>
                        <PropertiesList locale={locale as Locale} />
                    </div>
                </div>
            </div>
        </div>
    );
}