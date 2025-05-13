import Head from 'next/head'
import Link from 'next/link'
export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
    
  return (
    <>
      <div>
        <header className="w-full flex justify-between p-4 px-8 items-center text-white bg-gray-900 shadow-md shadow-gray-300">
          <h1 className="text-xl font-bold italic">Mini Project</h1>
          <ul className="flex space-x-4 font-semibold">
            <li>
              <Link
                href="/"
              >
                Home
              </Link>
            </li>
          </ul>
        </header>
        <main className="container mx-auto my-2 p-8 bg-neutral-50">
          {children}
        </main>
      </div>
    </>
  )
}
