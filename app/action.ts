'use server'

import { db } from '@/lib/db'
import { linksTable } from '@/lib/db/schema'
import { and, desc, eq, isNull, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type State = {
  message?: string | null;
  errors?: {
    title?: string;
    url?: string;
  } | null;
};

export async function getLinks(){
  try {
     const data = await db
        .select()
        .from(linksTable)
        .where(
            isNull(linksTable.deleted_at), 
        )
        .orderBy(desc(linksTable.updated_at))
    return data;
  } catch (error) {
    console.error('Error fetching link:', error);
    return undefined;
  }
}

export async function deleteLink(id: string): Promise<State> {
  try {
    await db.update(linksTable)
      .set({ deleted_at: sql`NOW()` })
      .where(eq(linksTable.id, Number(id)))

        return { message: 'Link deleted successfully' };
    } catch (error) {
        console.error('Error soft deleting link:', error);
        return { message: 'Failed to delete link.' };
    }
    revalidatePath('/');
    redirect('/');
}