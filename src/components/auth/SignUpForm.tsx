'use client';

import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import TextInput from '../shared/forms/TextInput';
import PasswordInput from '../shared/forms/PasswordInput';
import SecondaryButton from '../shared/buttons/SecondaryButton';
import RoleSelector from './RoleSelector';
import { useState } from 'react';
import { UserRole } from '@/constants/user';
import api from '@/libs/axios';
import { useSearchParams } from 'next/navigation';

const allowedRoles = [UserRole.TENANT, UserRole.LANDLORD] as const;

// Zod schema based on RegisterDto
const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, { message: 'name.required' })
        .max(50, { message: 'name.maxLength' }),
    email: z.email({ message: 'email.invalid' }),
    password: z
        .string()
        .trim()
        .min(8, { message: 'password.minLength' })
        .max(20, { message: 'password.maxLength' })
        .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$!%*?&])/, { message: 'password.pattern' }),
    role: z.enum(allowedRoles),
});


type RegisterFormValues = z.infer<typeof registerSchema>;

export default function SignUpForm() {
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

            toast.success(t('success.registered'));
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

                <p className="text-gray-600">
                    {t('didNotReceiveVerification')}{' '}
                    <Link href="/auth/resend-verification-email" className="text-primary font-medium underline">
                        {t('resend')}
                    </Link>
                </p>

            </div>

        </form>
    );
}
