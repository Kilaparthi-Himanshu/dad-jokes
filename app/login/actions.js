'use server';

import { redirect } from "next/navigation";
import { createClient } from "../utils/supabase/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

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
    const origin = (await headers()).get();
    const supabase = await createClient();
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    }

    const {error} = await supabase.auth.signUp({
        ...data,
        options: {
            emailRedirectTo: `${origin}`
        }
    });

    if (error) {
        console.error(error);
        redirect('/error');
    }
}