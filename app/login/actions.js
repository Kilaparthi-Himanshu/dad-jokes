'use server';

import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";
import { revalidatePath } from "next/cache";

const getURL = () => {
    let url = '';

    // Check if it's a development environment
    if (process.env.NODE_ENV === 'development') {
        url = 'http://localhost:3000/';
    } 
    // Check if it's a Vercel Preview Deployment
    else if (process.env.NEXT_PUBLIC_VERCEL_URL) {
        url = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    }
    // Default to Production URL if none of the above are true
    else {
        url = process?.env?.NEXT_PUBLIC_SITE_URL ?? 'https://dad-jokes-virid-beta.vercel.app';
    }

    // Ensure it starts with http/https and ends with a trailing slash
    url = url.startsWith('http') ? url : `https://${url}`;
    url = url.endsWith('/') ? url : `${url}/`;

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
            emailRedirectTo: 'https://dad-jokes-virid-beta.vercel.app',
          },
    });

    if (error) {
        console.error(error);
        redirect('/error');
    }
}