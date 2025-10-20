import { FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa";
import { AiFillInstagram } from "react-icons/ai";
import { Link } from "@/i18n/navigation";

type SocialIconsProps = {
    primary?: boolean;
    size?: number; // 👈 control icon size
    itemClassName?: string; // 👈 extra classes for each social item
};

const socials = [
    { href: "https://twitter.com", Icon: FaTwitter, label: "Twitter" },
    { href: "https://youtube.com", Icon: FaYoutube, label: "YouTube" },
    { href: "https://instagram.com", Icon: AiFillInstagram, label: "Instagram" },
    { href: "https://facebook.com", Icon: FaFacebook, label: "Facebook" },
];

export default function SocialIcons({
    primary = true,
    size = 24,
    itemClassName = "",
}: SocialIconsProps) {
    return (
        <div className="flex gap-2 sm:self-end">
            {socials.map(({ href, Icon, label }) => (
                <Link
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`w-8 h-8  flex items-center justify-center rounded-full text-white transition  ${primary
                        ? "hover:bg-secondary hover:text-white"
                        : "bg-secondary hover:bg-white hover:text-secondary"
                        } ${itemClassName}`}
                >
                    <Icon size={size} />
                </Link>
            ))}
        </div>
    );
}
