'use server';

import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";
import { revalidatePath } from "next/cache";

const getURL = () => {
    let url =
        process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
        process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
        'http://localhost:3000/'
    // Make sure to include `https://` when not localhost.
    url = url.startsWith('http') ? url : `https://${url}`
    // Make sure to include a trailing `/`.
    url = url.endsWith('/') ? url : `${url}/`
    return url
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
            redirectTo: 'https://dad-jokes-virid-beta.vercel.app',
          },
    });

    console.log(getURL());

    if (error) {
        console.error(error);
        redirect('/error');
    }
}