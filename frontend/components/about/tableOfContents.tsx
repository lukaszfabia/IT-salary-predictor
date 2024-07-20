import { FC } from "react"
import Link from "next/link"
import { Chapter } from "@/types"
import { Divider } from "@nextui-org/react"

export const TableOfContents: FC<{ chapters: Chapter[] }> = ({ chapters }) => {
    return (
        <aside className="invisible lg:visible w-full lg:w-1/4 lg:pl-10 lg:mt-10 lg:fixed lg:top-20 lg:right-0 lg:h-1/2 lg:overflow-y-auto">
            <h2 className="text-2xl mb-4">Table of Contents</h2>
            <Divider className="w-3/4 my-3" />
            <ul className="space-y-3 pl-5">
                {chapters.map((chapter) => (
                    <li key={chapter.anchor}>
                        <Link href={`#${chapter.anchor}`} className="text-blue-500 transition-all ease-in-out duration-200 hover:text-blue-700 dark:hover:text-blue-300">
                            {chapter.chapter}
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    )
}