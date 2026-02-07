"use client"

import {useState} from "react";
import {Comment} from "@/services/API";
import {serif} from "@fonts";

function boldText() {
    document.execCommand('bold');
}

function italicText() {
    document.execCommand('italic');
}

function underlineText() {
    document.execCommand('underline');
}

export default function CommentEditor({comment}: {comment?: Comment}) {
    const [text, setText] = useState(comment?.content ?? '');
    const [realText, setRealText] = useState(comment?.content ?? '');
    const percentLength: number =
        Number(Number(100 * (1 - (realText?.length / 600))).toFixed(0));
    const editorButton = `${serif.className} h-10 w-10 bg-red-600 hover:bg-red-700 
    rounded-md shadow-inner border-2 border-red-700`;
    return <form className={`grid md:max-w-[60vw] mx-auto my-16 border-2 md:border-red-300 md:rounded-xl md:shadow-lg`}>
        <div className={`bg-red-500 md:rounded-t-xl text-2xl px-4 py-2 flex flex-row gap-x-3.5`}>
            <button type={'button'} onClick={boldText} className={`${editorButton} font-extrabold`}>
                <b>B</b>
            </button>
            <button type={'button'} onClick={italicText} className={editorButton}>
                <i>i</i>
            </button>
            <button type={'button'} onClick={underlineText} className={`${editorButton} font-extrabold`}>
                <u>U</u>
            </button>
            <button type={'button'} className={editorButton}>L</button>
            <button type={'button'} className={editorButton}>I</button>
        </div>
        <div
            contentEditable={true}
            className={`
                text-white font-semibold h-64 border-x-[5px] border-red-500 shadow-inner
                px-3 py-2 text-2xl bg-red-400 outline-none break-all overflow-y-scroll
                `}
            onKeyDown={event => {
                // Prevents going back on backspace
                if (event.key === '8') {
                    event.stopPropagation();
                }
            }}
            onKeyUp={event => {
                setRealText(event.currentTarget.innerText);
                setText(event.currentTarget.innerHTML);
            }}
            onLoad={(event) => {
                setRealText(event.currentTarget.innerText);
            }}
        />
        <div className={'absolute grid mt-[16.4rem] mr-auto ml-[88%] md:ml-[54%] lg:ml-[56%] text-black'}>
            <div
                className={`bg-[conic-gradient(from_180deg,var(--tw-gradient-stops))] 
                from-transparent via-transparent ${percentParameters[percentLength]}
                to-[0%] border-5 rounded-full h-[38px] w-[38px]`}
            >
                <div className="text-center text-xs pt-2 bg-red-50 w-[31px] h-[31px] rounded-full mx-auto ml-[3.3px] mt-[3.1px]">
                    {/* Empty string char code is equal to 10, sets length properly */}
                    {realText.charCodeAt(0) === 10 ? 0 : realText.length}
                </div>
            </div>
        </div>
        <div className={`bg-red-500 md:rounded-b-xl text-lg px-4 py-3 flex flex-row gap-x-5 place-content-between`}>
            <button className={`font-bold bg-red-600 hover:bg-red-700 py-2 px-5
             rounded-md shadow-inner border border-red-700`}>
                Cancel
            </button>
            <button className={`font-bold bg-red-600 hover:bg-red-700 py-2 px-5 
            rounded-md shadow-inner border border-red-700`}>
                Post
            </button>
        </div>
    </form>;
}

// This seems silly, but Tailwind requires explicit strings only! Functions will not work!
const percentParameters: {
    [key: number]: string
} = {
    0: "via-100% to-red-700",
    1: "via-[99%] to-red-700",
    2: "via-[98%] to-red-700",
    3: "via-[97%] to-red-700",
    4: "via-[96%] to-red-700",
    5: "via-95% to-red-700",
    6: "via-[94%] to-red-700",
    7: "via-[93%] to-red-700",
    8: "via-[92%] to-red-700",
    9: "via-[91%] to-red-700",
    10: "via-90% to-red-600",
    11: "via-[89%] to-red-600",
    12: "via-[88%] to-red-600",
    13: "via-[87%] to-red-600",
    14: "via-[86%] to-red-600",
    15: "via-85% to-yellow-500",
    16: "via-[84%] to-yellow-500",
    17: "via-85% to-yellow-500",
    18: "via-85% to-yellow-500",
    19: "via-85% to-yellow-500",
    20: "via-80% to-yellow-500",
    25: "via-75% to-yellow-500",
    30: "via-70% to-yellow-500",
    35: "via-65% to-yellow-500",
    40: "via-60% to-green-500",
    45: "via-55% to-green-500",
    50: "via-50% to-green-500",
    55: "via-45% to-green-500",
    60: "via-40% to-green-600",
    65: "via-35% to-green-600",
    70: "via-30% to-green-600",
    75: "via-25% to-green-700",
    80: "via-20% to-green-700",
    85: "via-15% to-green-700",
    86: "via-30% to-green-700",
    87: "via-35% to-green-700",
    88: "via-[12%] to-green-700",
    89: "via-[11%] to-green-700",
    90: "via-10% to-green-700",
    91: "via-[9%] to-green-700",
    92: "via-[8%] to-green-700",
    93: "via-[7%] to-green-700",
    94: "via-[6%] to-green-700",
    95: "via-5% to-green-700",
    96: "via-[4%] to-green-700",
    97: "via-[3%] to-green-700",
    98: "via-[2%] to-green-700",
    99: "via-[1%] to-green-700",
    100: "via-0% to-green-700",
}