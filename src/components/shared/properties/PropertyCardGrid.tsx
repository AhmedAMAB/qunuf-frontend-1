import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { IoBedOutline } from "react-icons/io5";
import Tooltip from "../Tooltip";
import { ReactNode } from "react";
import { LuBath } from "react-icons/lu";
import { getTranslations } from "next-intl/server";


export type PropertyGrid = {
    id: string;
    title: string;
    address: string;
    price: number;
    imageUrl: string;
    location: string;
    bathrooms: number;
    bedrooms: number;
    garages: number;
    totalArea: number;
};

export default async function PropertyCardGrid({
    property,
}: {
    property: PropertyGrid;
    locale: "ar" | "en";
}) {

    const t = await getTranslations('property.grid')
    return (
        <div className="h-full relative max-w-[416px] rounded-[5px] w-fit mx-auto flex flex-col transition hover:shadow-2xl hover:-translate-y-1"
            style={{ boxShadow: "0px 4px 10px 0px #00000012" }}>
            <div className="max-w-[416px] overflow-hidden">

                <Image
                    src={property.imageUrl}
                    alt={property.title}
                    width={411}
                    height={260}
                    className=" h-[250px] xl:h-[230px] w-[416px]  object-cover image-scale"
                />
            </div>
            <div className="flex-1 flex flex-col gap-2 z-[1]  p-4">
                <div className="flex-1 flex flex-col gap-1">
                    <Link
                        href={`/properties/${property.id}`}
                        className="block font-semibold text-lg text-dark leading-snug"
                    >
                        {property.title}
                    </Link>

                    {/* Location from prop */}
                    <p className="text-sm font-medium text-dark">
                        {property.location}
                    </p>
                    <p className="text-primary font-semibold text-xl lg:text-[22px] sflex items-center justify-between gap-2">
                        ${property.price}
                    </p>
                </div>
                <div className="grid grid-cols-4 gap-3 justify-between items-end border-t border-[#7A74741A] pt-[10px]">
                    <InfoWithTooltip
                        icon={<IoBedOutline size={21} />}
                        label={t('bedrooms')}
                        value={property.bedrooms}
                    />
                    <InfoWithTooltip
                        icon={<LuBath size={21} />}
                        label={t('bathrooms')}
                        value={property.bathrooms}
                    />

                    <InfoWithTooltip
                        icon={
                            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.5202 0.5H4.14683C3.13601 0.501763 2.1671 0.904089 1.45234 1.61885C0.737585 2.3336 0.335259 3.30252 0.333496 4.31333V16.6867C0.335259 17.6975 0.737585 18.6664 1.45234 19.3812C2.1671 20.0959 3.13601 20.4982 4.14683 20.5H16.5202C17.531 20.4982 18.4999 20.0959 19.2146 19.3812C19.9294 18.6664 20.3317 17.6975 20.3335 16.6867V4.31333C20.3317 3.30252 19.9294 2.3336 19.2146 1.61885C18.4999 0.904089 17.531 0.501763 16.5202 0.5ZM19.0002 16.6867C18.9984 17.3439 18.7366 17.9736 18.2718 18.4383C17.8071 18.9031 17.1774 19.1649 16.5202 19.1667H4.14683C3.48963 19.1649 2.85986 18.9031 2.39515 18.4383C1.93044 17.9736 1.66859 17.3439 1.66683 16.6867V4.31333C1.66859 3.65614 1.93044 3.02636 2.39515 2.56165C2.85986 2.09694 3.48963 1.83509 4.14683 1.83333H16.5202C17.1774 1.83509 17.8071 2.09694 18.2718 2.56165C18.7366 3.02636 18.9984 3.65614 19.0002 4.31333V16.6867Z" fill="var(--primary)" />
                                <path d="M16.9328 11.8492C16.7384 11.8492 16.5518 11.9264 16.4143 12.064C16.2768 12.2015 16.1995 12.388 16.1995 12.5825V15.3325L5.50018 4.63317H8.25018C8.44467 4.63317 8.6312 4.55591 8.76872 4.41838C8.90625 4.28086 8.98351 4.09433 8.98351 3.89984C8.98351 3.70535 8.90625 3.51882 8.76872 3.38129C8.6312 3.24377 8.44467 3.1665 8.25018 3.1665H3.50551C3.37131 3.1665 3.24261 3.21981 3.14772 3.31471C3.05282 3.4096 2.99951 3.5383 2.99951 3.6725V8.41717C2.99951 8.61166 3.07677 8.79819 3.2143 8.93572C3.35183 9.07324 3.53835 9.1505 3.73285 9.1505C3.92734 9.1505 4.11386 9.07324 4.25139 8.93572C4.38892 8.79819 4.46618 8.61166 4.46618 8.41717V5.66717L15.1655 16.3665H12.4155C12.221 16.3665 12.0345 16.4438 11.897 16.5813C11.7594 16.7188 11.6822 16.9053 11.6822 17.0998C11.6822 17.2943 11.7594 17.4809 11.897 17.6184C12.0345 17.7559 12.221 17.8332 12.4155 17.8332H17.1602C17.2944 17.8332 17.4231 17.7799 17.518 17.685C17.6129 17.5901 17.6662 17.4614 17.6662 17.3272V12.5825C17.6662 12.388 17.5889 12.2015 17.4514 12.064C17.3139 11.9264 17.1273 11.8492 16.9328 11.8492Z" fill="var(--primary)" />
                            </svg>
                        }
                        label={t('totalArea')}
                        value={property.totalArea}
                    />

                    <InfoWithTooltip
                        icon={
                            <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21.1055 5.34005L11.3555 0.0900479C11.1343 -0.0292021 10.8665 -0.0292021 10.6453 0.0900479L0.89525 5.34005C0.6515 5.47055 0.5 5.72405 0.5 6.00005V20.25C0.5 20.664 0.83525 21 1.25 21H20.75C21.1647 21 21.5 20.664 21.5 20.25V6.00005C21.5 5.72405 21.3485 5.47055 21.1055 5.34005ZM5.75 13.5H16.25V15.75H5.75V13.5ZM16.25 12H5.75V9.75005H16.25V12ZM5.75 19.5V17.25H16.25V19.5H5.75ZM20 19.5H17.75V9.00005C17.75 8.58605 17.4147 8.25005 17 8.25005H5C4.58525 8.25005 4.25 8.58605 4.25 9.00005V19.5H2V6.4478L11 1.60205L20 6.4478V19.5Z" fill="var(--primary)" />
                            </svg>

                        }
                        label={t('garages')}
                        value={property.garages}
                    />

                </div>
            </div>
        </div>
    );
}


type InfoWithTooltipProps = {
    icon: ReactNode;
    label: string;
    value: string | number;
};

function InfoWithTooltip({ icon, label, value }: InfoWithTooltipProps) {
    return (
        <Tooltip content={`${label} ${value}`}>
            <div className="flex flex-col gap-1 relative max-w-full">
                <div className="flex gap-2 items-center">
                    <div className="shrink-0 text-primary">{icon}</div>
                    <span className="text-sm">{value}</span>
                </div>
                <span className="text-input font-medium text-[13px] truncate peer">{label}</span>
            </div>
        </Tooltip>
    );
}