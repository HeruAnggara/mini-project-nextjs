'use server'

import { url } from 'inspector'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

type FieldErrors = {
    [key: string]: string[]
}

export async function createLink(prevState: {
    message: string | null
    errors: object | null
}, formData: FormData) {
    const formSchema = z.object({
        title: z.string().min(1, 'Title wajib diisi'),
        url: z.string().min(1, 'Url wajib diisi'),
    })

    const validateForm = formSchema.safeParse({
        title: formData.get('title'),
        url: formData.get('url'),
    })

    if (!validateForm.success) {
        const fieldErrors: FieldErrors = validateForm.error.formErrors.fieldErrors || {}
        const errors = Object.keys(fieldErrors)?.reduce(
            (acc, key) => {
              acc[key] = fieldErrors[key]?.[0] || 'Unknown error'
              return acc
            },
            {} as Record<string, string>,
        )

        return { errors }
    }    

    try {
        await fetch('http://localhost:3000/api/links', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(validateForm.data)
        }).then(res => res.json())
    } catch (error) {
        return {
            message: 'Something went wrong',
        }
    }

    revalidatePath('/')
    redirect('/')
}