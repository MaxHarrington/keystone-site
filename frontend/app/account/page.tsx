// import Form from 'next/form'
import getSession from "@/components/actions/getSession";
import {serif} from "@fonts";

export default async function AccountManager() {
    const session = await getSession();
    console.log(session);
    let name: string = 'Invalid username';
    let updates: string = 'Invalid update value';
    if (typeof session?.name === 'string') name = session.name;
    if (typeof session?.updates === 'string') updates = session.updates;
    return <>
        <main className={`flex flex-col lg:max-w-[50%] h-[70vh] lg:ml-[20%] lg:mr-[8%] mt-16`}>
            <div className={`${serif.className} text-center text-2xl place-self-center`}>
                Welcome back, {name}.
            </div>
            <div className={`place-self-center mt-12 mb-20`}>
                {updates}

                {/*<Form action={}>*/}

                {/*</Form>*/}
            </div>
        </main>
    </>
};