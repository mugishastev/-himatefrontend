import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, registerSchema } from '../auth.schema';

export const useAuthForm = <T extends 'login' | 'register'>(type: T) => {
    const isLogin = type === 'login';
    const schema = isLogin ? loginSchema : registerSchema;

    const form = useForm<any>({
        resolver: zodResolver(schema),
    });

    return form as any;
};
