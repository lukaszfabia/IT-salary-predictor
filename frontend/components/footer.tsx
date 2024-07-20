import { Link } from "@nextui-org/link"
import { FC } from "react"

export const Footer: FC = () => {
    return (
        <footer className="w-full flex items-center justify-center py-10">
            <p className="flex items-center gap-1 text-current mx-0.5 text-default-500">
                <span>Powered by <Link className="text-default-700 dark:text-default-600" isExternal href="https://justjoin.it">justjoin.it.</Link></span>
                <span>Created by <Link href="https://lukaszfabia.vercel.app" isExternal className="text-default-700 dark:text-default-600">Lukasz Fabia</Link></span>
            </p>
        </footer>
    )
}