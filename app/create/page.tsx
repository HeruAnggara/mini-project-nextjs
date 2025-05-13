'use client'

import { Button } from "@/components/ui/button";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createLink } from "./action";

const initialState = {
  message: '',
  errors: {
    title: '',
    url: '',
  }
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <div className="flex justify-end">
      <Button
        disabled={pending}
        type="submit"
      >
        Submit
      </Button>
    </div>
  )
}

export default function CreateLink() {
    const [state, formAction] = useActionState(createLink, initialState)
    return (
      <div className="grid grid-cols-1 gap-4 mx-auto">
        <div className="container">
          <h1 className="text-xl font-bold mb-4">Add Link</h1>
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
              />
              {state && state.errors && (
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
              />
              {state && state.errors && (
                  <p className="text-red-500 text-sm mt-1">{state.errors.url}</p>
              )}
              </div>
              <SubmitButton />
          </form>
        </div>
      </div>
    )
}