'use client';

import { Button } from '@/components/ui/button';
import { use, useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { getLink, updateLink } from './action'; // Assuming these actions exist

const initialState = {
  message: '',
  errors: {
    title: '',
    url: '',
  },
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <div className="flex justify-end">
      <Button disabled={pending} type="submit">
        {pending ? 'Updating...' : 'Update'}
      </Button>
    </div>
  );
}

export default function EditLink({
  params,
}: {
  params: { id: string };
}) {
  const [link, setLink] = useState<{ title: string; url: string } | null>(null);
  const [state, formAction] = useActionState(updateLink, initialState);
  const param = use(params);
  const id = param.id

  useEffect(() => {
    async function fetchLink() {
      const initialLink = await getLink(id);
      if (initialLink) {
        setLink(initialLink);
      } else {
        console.error(`Link with ID ${id} not found.`);
      }
    }

    fetchLink();
  }, [id]);

  if (!link) {
    return <div>Loading link data...</div>; // Or a more informative loading state
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="container mx-auto">
        <h1 className="text-xl font-bold">Edit Link</h1>
        <form action={formAction} className="space-y-8">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-600"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Title . . ."
              className="mt-1 p-2 border rounded-md w-full"
              defaultValue={link.title} // Populate with existing data
            />
            {state && state.errors && state.errors.title && (
              <p className="text-red-500 text-sm mt-1">{state.errors.title}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="url"
              className="block text-sm font-medium text-gray-600"
            >
              URL
            </label>
            <input
              type="text"
              id="url"
              name="url"
              placeholder="URL..."
              className="mt-1 p-2 border rounded-md w-full"
              defaultValue={link.url} // Populate with existing data
            />
            {state && state.errors && state.errors.url && (
              <p className="text-red-500 text-sm mt-1">{state.errors.url}</p>
            )}
          </div>
          {state?.message && <p className="text-green-500">{state.message}</p>}
          <input type="hidden" name="id" value={id} /> {/* Pass the ID to the action */}
          <SubmitButton />
        </form>
      </div>
    </div>
  );
}