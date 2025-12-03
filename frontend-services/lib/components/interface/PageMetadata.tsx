import {
    ChatBubbleLeftRightIcon,
    DocumentIcon,
    FlagIcon,
    GlobeAsiaAustraliaIcon,
    LockClosedIcon,
    NewspaperIcon,
    WrenchScrewdriverIcon
} from '@heroicons/react/24/solid';

export function PostMetadata({type, privacy}: { type: string, privacy: string }) {
    return <>
        {privacy === 'Public' || privacy === 'Semi-public' ?
            <GlobeAsiaAustraliaIcon className="ml-auto text-amber-300" title={privacy} height={24}
                                    width={24}/> : <></>}
        {privacy === 'Users' ?
            <ChatBubbleLeftRightIcon className="ml-auto text-amber-300" title={privacy} height={24}
                                     width={24}/> : <></>}
        {privacy === 'Posters' ?
            <LockClosedIcon className="ml-auto text-amber-300" title={privacy} height={24}
                            width={24}/> : <></>}
        {type === 'Update' ? <FlagIcon className="ml-auto text-amber-300" title={type} height={24}
                                       width={24}/> : <></>}
        {type === 'Note' ? <DocumentIcon className="ml-auto text-amber-300" title={type} height={24}
                                         width={24}/> : <></>}
        {type === 'Article' ?
            <NewspaperIcon className="ml-auto text-amber-300" title={type} height={24}
                           width={24}/> : <></>}
        {type === 'System' ?
            <WrenchScrewdriverIcon className="ml-auto text-amber-300" title={type} height={24}
                                   width={24}/> : <></>}
    </>
}