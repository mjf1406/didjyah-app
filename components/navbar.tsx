/** @format */

import Link from "next/link";
import { LogoHeader } from "./brand/logo";
import { ThemeSelect } from "./theme/theme-select";
import { UserButton } from "@clerk/nextjs";

const NAV_LINKS = [
    {
        title: "Top",
        href: "#hero",
        external: false,
    },
    {
        title: "Features",
        href: "#features",
        external: false,
    },
    {
        title: "Pricing",
        href: "#pricing",
        external: false,
    },
    {
        title: "FAQ",
        href: "#faq",
        external: false,
    },
];

export function Navbar() {
    return (
        <nav className="sticky top-0 z-40 w-full h-16 border-b backdrop-filter backdrop-blur-xl bg-opacity-5 md:px-4 px-2 flex justify-between items-center">
            <LogoHeader />
            <div className="flex justify-between items-center">
                {NAV_LINKS.map(({ title, href, external }) => (
                    <Link
                        key={href}
                        href={href}
                        className="px-3 text-sm font-medium hover:opacity-60"
                        {...(external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                    >
                        {title}
                    </Link>
                ))}
                <div className="flex items-center justify-center gap-2">
                    <UserButton />
                    <ThemeSelect />
                </div>
            </div>
        </nav>
    );
}
