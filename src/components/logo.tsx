import { Press_Start_2P } from "next/font/google"

const press_start_2p = Press_Start_2P({
    weight: ["400"],
    subsets: ["cyrillic", "latin"]
})

export default function Logo() {
    return (
        <span className={`${press_start_2p.className} text-amber-500 text-xl`}>ATLAS</span>
    )
}