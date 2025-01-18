'use server';

import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function login(formData) {
    const supabase = await createClient();
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    const {error} = await supabase.auth.signInWithPassword(data);

    if (error) {
        console.error(error);
        redirect('/error');
    }

    revalidatePath('/', 'layout');
    redirect('/');
}

export async function signup(formData) {
    const env = process.env.NODE_ENV;
    console.log(env);

    const supabase = await createClient();
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    }

    const {error} = await supabase.auth.signUp({
        ...data,
        emailRedirectTo: env === 'production' ? 'https://dad-jokes-virid-beta.vercel.app' : 'http://localhost:3000/'
    });

    if (error) {
        console.error(error);
        redirect('/error');
    }
}