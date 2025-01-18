'use server';

import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";
import { revalidatePath } from "next/cache";

const getURL = () => {
    let url =
        process?.env?.NEXT_PUBLIC_SITE_URL ?? // Production URL from the environment
        process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Vercel preview URL automatically set by Vercel
        (process.env.NODE_ENV === 'production' ? 'https://dad-jokes-virid-beta.vercel.app' : 'http://localhost:3000/'); // Localhost URL for development
    // Make sure to include `https://` when not localhost.
    url = url.startsWith('http') ? url : `https://${url}`
    // Make sure to include a trailing `/`.
    url = url.endsWith('/') ? url : `${url}/`
    return url;
}

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
    const supabase = await createClient();
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    }

    const {error} = await supabase.auth.signUp({
        ...data,
        options: {
            emailRedirectTo: getURL(),
          },
    });

    console.log(getURL());

    if (error) {
        console.error(error);
        redirect('/error');
    }
}