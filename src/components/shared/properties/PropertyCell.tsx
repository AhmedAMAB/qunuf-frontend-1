import Image from "next/image";
import { Link } from "@/i18n/navigation";
import SmartTooltip from "../SmartTooltip";


export function PropertyCell({
    id,
    imagePath,
    name,
}: {
    id: string;
    imagePath: string;
    name: string;
}) {
    return (
        <div className="flex items-center gap-2 min-w-fit">
            <Image
                src={imagePath}
                width={40}
                height={40}
                alt={name}
                className="w-[40px] h-[40px] rounded-[8px] shrink-0"
            />
            <Link href={`/properties/${id}`} className="cursor-pointer">
                <SmartTooltip
                    value={name}
                    maxLength={{ xs: 10, sm: 15, md: 20, lg: 30, xl: 40 }}
                    className="text-dark cursor-pointer"
                />
            </Link>
        </div>
    );
}
