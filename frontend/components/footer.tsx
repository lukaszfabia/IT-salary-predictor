import { footerLinks } from "@/config/links"
import { FooterItem } from "@/types"
import { Link } from "@nextui-org/link"
import { FC } from "react"

export const Footer: FC = () => {
    return (
        <footer className="w-full flex items-center justify-center py-10">
            {footerLinks.map((link: FooterItem) => (
                <Link
                    key={link.href}
                    isExternal
                    href={link.href}
                    title={link.title}
                    className="flex items-center gap-1 text-current mx-0.5">
                    <span className="text-default-600">{link.label}</span>
                    <p className="text-primary">{link.brand}</p>
                </Link>
            ))}
        </footer>
    )
}