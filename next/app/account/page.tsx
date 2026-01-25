// import Form from 'next/form'
import getSession from "@/components/actions/getSession";
import {serif} from "@fonts";
import DropdownMenu from "@/components/interface/DropdownMenu";

export default async function AccountManager() {
    const session = await getSession();
    let name: string = 'Invalid username';
    let expiry: string = 'Invalid expiry date';
    let updates: string = 'Invalid update value';
    if (typeof session?.user?.name === 'string') name = session.user.name;
    if (typeof session?.user?.updates === 'string') updates = session.user.updates;
    if (typeof session?.expiry === 'string') expiry =
        `${new Date(session.expiry).toDateString()} at ${new Date(session.expiry).toTimeString()}`;
    return <>
        <main className={`flex flex-col lg:max-w-[50%] h-[70vh] lg:ml-auto lg:mr-[8%] mt-16`}>
            <DropdownMenu session={session} />
            <div className={`${serif.className} text-center text-2xl place-self-center`}>
                Welcome back, {name}.
            </div>
            <div className={`place-self-center mt-12 mb-20`}>
                {updates}

                {/*<Form action={}>*/}

                {/*</Form>*/}
            </div>
            <div className={`text-center`}>
                You&apos;re logged in on here until {expiry}.
            </div>
        </main>
    </>
};