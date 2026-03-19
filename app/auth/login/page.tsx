import { Suspense } from 'react';
import { LoginForm } from '@/components/forms/login-form';

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center min-h-[50vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
            <LoginForm />
        </Suspense>
    );
}
