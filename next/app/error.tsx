'use client'

export default function GlobalError({error, reset}: { error: Error & { digest?: string }, reset: () => void }) {
    return <>
        <html>
        <body className="grid h-screen w-screen place-items-center">
        <div className="grid place-content-center gap-y-3">
            <div className="text-center font-serif font-2xl">
                Something went wrong! Please wait and try again.
            </div>
            <button
                className={`m-auto mt-3 w-[200px] inline-flex justify-center hover:cursor-pointer 
            rounded-md border border-transparent bg-red-500 px-6 py-3 text-lg font-bold text-white 
            hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 
            focus-visible:ring-offset-2`} onClick={() => reset()}>
                Try again
            </button>
        </div>
        </body>
        </html>
    </>;
}