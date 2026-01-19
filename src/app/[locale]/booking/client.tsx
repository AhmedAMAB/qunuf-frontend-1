'use client';

import { JSX, useState, useEffect } from 'react';
import { IoMdCheckmark } from 'react-icons/io';

import Logo from '@/components/shared/Logo';
import LocaleSwitcher from '@/components/shared/LocaleSwitcher';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import api from '@/libs/axios';
import toast from 'react-hot-toast';
import { PropertyStatus, RentType } from '@/types/dashboard/properties';
import Step1 from '@/components/pages/booking/Step1';
import Step2 from '@/components/pages/booking/Step2';
import Step3 from '@/components/pages/booking/Step3';
import Step4 from '@/components/pages/booking/Step4';


const steps = [1, 2, 3];

interface StepProps {
    nextStep: () => void;
    property: { id: string; rentType: RentType; status: PropertyStatus };
    createdContract: any; // Replace 'any' with your Contract type
    setCreatedContract: (contract: any) => void;
}

const stepComponents: Record<number, (props: StepProps) => JSX.Element> = {
    1: (props) => <Step1 {...props} />,
    2: (props) => <Step2 {...props} />,
    3: (props) => <Step3 {...props} />,
};

export default function BookingClient() {
    const [activeStep, setActiveStep] = useState(1);
    const [completed, setCompleted] = useState(false);
    const [checking, setChecking] = useState(true);
    const [property, setProperty] = useState(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    const t = useTranslations('bookings');
    const [createdContract, setCreatedContract] = useState<any>(null);

    useEffect(() => {
        const checkEligibility = async () => {
            const propertyId = searchParams.get('property');

            if (!propertyId) {
                toast.error(t('eligibility.errors.noProperty'));
                router.push('/properties');
                return;
            }

            try {
                setChecking(true);
                const response = await api.get(`/contracts/check-eligibility/${propertyId}`);

                if (!response.data.allowed) {
                    toast.error(response.data.message || t('eligibility.errors.notAllowed'));
                    if (response.data.contractId) {
                        router.push(`/dashboard/contracts?view=${response.data.contractId}`);
                        return;
                    }
                    router.push('/properties');
                    return;
                }

                // If user has existing contract, redirect to view it


                setProperty(response.data?.property)
                setChecking(false);
            } catch (error: any) {
                const errorMessage = error?.response?.data?.message || t('eligibility.errors.checkFailed');
                toast.error(errorMessage);
                router.push('/properties');
            } finally {
                setChecking(false);
            }
        };

        checkEligibility();
    }, [searchParams, router, t]);

    const nextStep = () => {
        if (activeStep < steps.length) {
            setActiveStep((prev) => prev + 1);
        } else {
            setCompleted(true);
        }
    };

    if (checking) {
        return (
            <div className="mx-2 flex flex-col hero-height booking">
                <div className="border-b border-b-gray py-3 flex items-center justify-center gap-5">
                    <Logo className="justify-center" />
                    <LocaleSwitcher />
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-lg">{t('eligibility.checking')}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-2 flex flex-col hero-height booking">
            <div className="border-b border-b-gray py-3 flex items-center justify-center gap-5">
                <Logo className="justify-center" />
                <LocaleSwitcher />
            </div>

            <div className="flex-1 flex flex-col container pt-12 pb-6">
                {!completed ? (
                    <>
                        {/* Stepper */}
                        <div className="relative mx-auto w-fit mb-10">
                            <div className="z-[1] absolute h-[1px] bg-lighter w-[calc(100%-20px)] top-1/2 -translate-y-1/2 start-[10px]" />
                            <div className="relative z-[2] flex justify-center items-center gap-10">
                                {steps.map((step) => {
                                    const isActive = step === activeStep;
                                    const isCompleted = step < activeStep;

                                    return (
                                        <div
                                            key={step}
                                            className={`rounded-full flex-center w-[50px] h-[50px] text-2xl ${isCompleted
                                                ? 'bg-secondary text-white'
                                                : isActive
                                                    ? 'bg-secondary text-white'
                                                    : 'bg-lighter text-dark'
                                                }`}
                                        >
                                            {isCompleted ? <IoMdCheckmark size={32} /> : step}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Current Step */}
                        <div className="flex-1 flex flex-col">
                            {stepComponents[activeStep]({
                                nextStep,
                                property,
                                createdContract,
                                setCreatedContract
                            })}
                        </div>
                    </>
                ) : (
                    <Step4 />
                )}
            </div>
        </div>
    );
}
