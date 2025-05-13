'use server'

import { db } from '@/lib/db'
import { linksTable } from '@/lib/db/schema'
import { and, desc, eq, isNull, sql } from 'drizzle-orm'
import { url } from 'inspector'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

type FieldErrors = {
    [key: string]: string[]
}

export async function getLink(id: string): Promise<{ title: string; url: string } | undefined> {
  try {
     const data = await db
        .select()
        .from(linksTable)
        .where(
          and(
            eq(linksTable.id, Number(id)),
            isNull(linksTable.deleted_at), 
          )
        )
        .orderBy(desc(linksTable.updated_at))
    return data[0];
  } catch (error) {
    console.error('Error fetching link:', error);
    return undefined;
  }
}

export async function updateLink(prevState: {
    message: string | null
    errors: object | null
}, formData: FormData) {
    const formSchema = z.object({
        id: z.string(),
        title: z.string().min(3),
        url: z.string().url(),
    });

    const validateForm = formSchema.safeParse({
        id: formData.get('id'),
        title: formData.get('title'),
        url: formData.get('url'),
    });

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
    
    const { id, title, url } = validateForm.data;

    try {
         await db.update(linksTable)
            .set({ title: title, url: url, updated_at: sql`NOW()` })
            .where(eq(linksTable.id, Number(id)));        
    } catch (error) {
        return {
            message: 'Something went wrong',
        }
    }
    revalidatePath('/')
    redirect(`/`)
}   