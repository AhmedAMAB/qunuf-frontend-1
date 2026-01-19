import LocaleSwitcher from "../shared/LocaleSwitcher";
import Logo from "../shared/Logo";


export default function AuthHeader({ className }: { className?: string }) {
    return (
        <div className={`mb-10 flex justify-between items-center ${className}`}>
            <Logo small />
            <LocaleSwitcher />
        </div>
    );
}