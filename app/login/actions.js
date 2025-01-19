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
    const getURL = () => {
        // If in a browser context
        if (typeof window !== "undefined") {
          const url = new URL(window.location.href); // Get the full URL
          return `${url.origin}/`; // Extract the origin (base URL) and ensure a trailing slash
        }

        // Fallback for server-side rendering (e.g., development or non-browser context)
        let url = "";
        if (process.env.NODE_ENV === "development") {
          url = "http://localhost:3000/";
        } else if (process.env.NEXT_PUBLIC_VERCEL_URL) {
          url = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
        } else {
          url = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dad-jokes-virid-beta.vercel.app/";
        }
      
        return url.endsWith("/") ? url : `${url}/`;
    };
    
    const origin = getURL(); // Dynamically fetch the origin

    const supabase = await createClient();
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    }

    const {error} = await supabase.auth.signUp({
        ...data,
        emailRedirectTo: `${origin}`, // Dynamically set the redirect URL
    });

    if (error) {
        console.error(error);
        redirect('/error');
    }
}