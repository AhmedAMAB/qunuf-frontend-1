'use client'
import AuthHeader from "@/components/atoms/AuthHeader";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link, useRouter } from '@/i18n/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { ReactNode, useState } from 'react';
import { UserRole } from '@/constants/user';
import api from '@/libs/axios';
import { useSearchParams } from 'next/navigation';
import SecondaryButton from "@/components/shared/buttons/SecondaryButton";
import PasswordInput from "@/components/shared/forms/PasswordInput";
import TextInput from "@/components/shared/forms/TextInput";
import { FaUser } from "react-icons/fa";
import { PiHouseLine } from "react-icons/pi";

export async function generateMetadata() {
    const t = useTranslations('auth.signUp');
    return {
        title: t('title'),
    };
}

export default function SignUpClient() {
    const t = useTranslations('auth.signUp');

    return (
        <div className="py-20">
            <div className="container max-w-[1200px] mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-stretch justify-between rounded-2xl custom-shadow overflow-hidden">
                    <div className="w-full lg:w-[50%] bg-white p-5 md:p-6 lg:p-8 flex flex-col gap-10">
                        <div className="flex flex-col gap-2">
                            <AuthHeader />
                            <h1 className="text-dark font-semibold text-[28px] sm:text-[32px] md:text-[34px] leading-[100%] tracking-normal">
                                {t('title')}
                            </h1>
                            <p className="text-dark font-light text-[16px] sm:text-[17px] md:text-[18px] leading-[100%] tracking-normal">
                                {t('subtitle')}
                            </p>
                        </div>
                        <SignUpForm />
                    </div>
                    <div className="relative w-full lg:w-[50%] bg-white flex items-center justify-center">
                        <div className="absolute inset-0 opacity-20 z-[2]"
                            style={{ background: "linear-gradient(180deg, var(--primary) 0%, var(--lightGold) 100%)" }}></div>
                        <Image src="/auth/signup.jpg" fill alt="sign in" className="z-[1] object-cover" />
                    </div>
                </div>
            </div>
        </div>
    );
}


const allowedRoles = [UserRole.TENANT, UserRole.LANDLORD] as const;

// Zod schema based on RegisterDto
const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, { message: 'name.required' })
        .max(50, { message: 'name.maxLength' }),
    email: z.string().min(1, { message: 'email.required' }).email({ message: 'email.invalid' }),
    password: z
        .string()
        .trim()
        .min(8, { message: 'password.minLength' })
        .max(20, { message: 'password.maxLength' })
        .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$!%*?&])/, { message: 'password.pattern' }),
    role: z.enum(allowedRoles),
});


type RegisterFormValues = z.infer<typeof registerSchema>;

function SignUpForm() {
    const t = useTranslations('auth.signUp');
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);

    const initalRole = searchParams.get("type") as UserRole.TENANT | UserRole.LANDLORD | null;
    const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: { name: '', email: '', password: '', role: initalRole && [UserRole.TENANT, UserRole.LANDLORD].includes(initalRole) ? initalRole : UserRole.TENANT, },
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setLoading(true);
        try {
            await api.post('/auth/register', data);

            toast.success(t('success.emailSend'));
            router.push('/auth/sign-in');
        } catch (err: any) {
            toast.error(err.response.data.message || t('errors.registrationFailed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="flex flex-col gap-4 md:gap-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Name */}
            <Controller
                name="name"
                control={control}
                render={({ field }) => (
                    <TextInput
                        type='text'
                        label={t('name.label')}
                        placeholder={t('name.placeholder')}
                        {...field}
                        error={errors.name?.message ? t(`errors.${errors.name.message}`) : undefined}
                    />
                )}
            />

            {/* Email */}
            <Controller
                name="email"
                control={control}
                render={({ field }) => (
                    <TextInput
                        label={t('email.label')}
                        placeholder={t('email.placeholder')}
                        type="email"
                        {...field}
                        error={errors.email?.message ? t(`errors.${errors.email.message}`) : undefined}
                    />
                )}
            />

            {/* Password */}
            <Controller
                name="password"
                control={control}
                render={({ field }) => (
                    <PasswordInput
                        label={t('password.label')}
                        placeholder={t('password.placeholder')}
                        {...field}
                        error={errors.password?.message ? t(`errors.${errors.password.message}`) : undefined}
                    />
                )}
            />

            {/* Role */}
            <Controller
                name="role"
                control={control}
                render={({ field }) => (
                    <RoleSelector
                        selectedRole={field.value.toLowerCase() as 'tenant' | 'landlord'}
                        setSelectedRole={(role) => field.onChange(role)}
                    />
                )}
            />

            <SecondaryButton
                type="submit"
                className="bg-secondary hover:bg-secondary-hover text-white py-2 lg:py-3 w-full"
                disabled={loading}
            >
                {loading ? t('loading') : t('register')}
            </SecondaryButton>

            <div className="flex flex-col gap-2 text-center text-sm mt-6">

                <p className="text-gray-700">
                    {t('haveAccount')}{' '}
                    <Link href="/auth/sign-in" className="text-primary font-semibold underline">
                        {t('login')}
                    </Link>
                </p>

                {/* <p className="text-gray-600">
                    {t('didNotReceiveVerification')}{' '}
                    <Link href="/auth/resend-verification-email" className="text-primary font-medium underline">
                        {t('resend')}
                    </Link>
                </p> */}

            </div>

        </form>
    );
}


type RoleType = 'tenant' | 'landlord';

interface RoleSelectorProps {
    selectedRole: RoleType;
    setSelectedRole: (role: RoleType) => void;
}

function RoleSelector({ selectedRole, setSelectedRole }: RoleSelectorProps) {
    const t = useTranslations('auth.roleSelector');

    return (
        <div className="flex gap-4 md:gap-6 flex-col md:flex-row justify-center">
            <RoleOption
                title={t('tenant.title')}
                description={t('tenant.description')}
                selected={selectedRole === UserRole.TENANT}
                onClick={() => setSelectedRole(UserRole.TENANT)}
                icon={<FaUser size={24} />}
            />
            <RoleOption
                title={t('landlord.title')}
                description={t('landlord.description')}
                selected={selectedRole === UserRole.LANDLORD}
                onClick={() => setSelectedRole(UserRole.LANDLORD)}
                icon={<PiHouseLine size={26} />}
            />
        </div>
    );
}



interface RoleOptionProps {
    selected: boolean;
    onClick: () => void;
    title: string;
    description: string;
    icon: ReactNode;
}
function RoleOption({
    selected,
    onClick,
    title,
    description,
    icon,
}: RoleOptionProps) {
    return (
        <div
            onClick={onClick}
            className={`
        relative w-full rounded-[10px] border cursor-pointer transition-colors 
        ${selected ? 'border-[#45A9EA]' : 'border-gray'}
      `}
        >
            {/* Top-right ball */}
            <div
                className={`
          absolute w-[16px] h-[16px] rounded-full top-[18px] end-[18px]
          ${selected ? 'bg-secondary' : 'bg-gray'}
        `}
            />

            {/* Content */}
            <div className="flex items-start gap-4 p-4 sm:p-5 lg:p-6">
                <div className="text-primary mt-1 shrink-0">{icon}</div>
                <div>
                    <h3 className="text-[18px] sm:text-[20px] lg:text-[22px] font-medium capitalize leading-[100%]">
                        {title}
                    </h3>
                    <p className="text-[14px] sm:text-[15px] lg:text-[16px] font-normal leading-[100%] text-[var(--neutral-600)] mt-2">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}
