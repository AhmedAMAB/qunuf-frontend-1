import Image from "next/image";
import { Link } from "@/i18n/navigation";

interface PropertyCardProps {
    imageSrc: string;
    address: string;
    date: Date;
    price: number;
    id?: string;
}

export default function RentedPropertyCard({
    imageSrc,
    address,
    date,
    id,
    price
}: PropertyCardProps) {
    const formattedDate = date.toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    return (
        <div className="group flex justify-between items-center gap-4 py-3 px-2 hover:bg-secondary/5 rounded-xl transition-all duration-200">
            <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Property Image */}
                <div className="relative shrink-0">
                    {/* Glow effect on hover */}
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-secondary/30 to-primary/30 rounded-full opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />
                    
                    {/* Image Container */}
                    <div className="relative w-[58px] h-[58px] rounded-full overflow-hidden ring-2 ring-gray/20 group-hover:ring-secondary/40 transition-all duration-300 shadow-md">
                        <Image 
                            src={imageSrc} 
                            fill 
                            alt={address} 
                            className="object-cover transition-transform duration-300 group-hover:scale-110" 
                        />
                    </div>
                </div>

                {/* Property Info */}
                <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                    {id ? (
                        <Link 
                            href={`/properties/${id}`} 
                            className="font-semibold text-sm sm:text-base text-dark hover:text-primary transition-colors duration-200 truncate"
                        >
                            {address}
                        </Link>
                    ) : (
                        <h4 className="font-semibold text-sm sm:text-base text-dark truncate">
                            {address}
                        </h4>
                    )}
                    
                    {/* Date with icon */}
                    <div className="flex items-center gap-1.5 text-dark/60 text-xs sm:text-sm">
                        <svg 
                            className="w-3.5 h-3.5 flex-shrink-0" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                            />
                        </svg>
                        <span className="truncate">{formattedDate}</span>
                    </div>
                </div>
            </div>

            {/* Price Badge */}
            <div className="shrink-0">
                <div className="relative group/price">
                    {/* Glow effect on hover */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-secondary/30 to-primary/30 rounded-xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />
                    
                    {/* Price Container */}
                    <div className="relative px-3 py-2 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-xl border border-secondary/20 group-hover:border-secondary/40 transition-all duration-200 shadow-sm">
                        <p className="text-sm md:text-base font-bold text-dark whitespace-nowrap">
                            {price.toLocaleString()} SAR
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}