/** @format */

import { Mail } from "lucide-react";
import { BsTwitterX, BsGithub, BsLinkedin, BsYoutube } from "react-icons/bs";

export const APP_NAME = "DidjYah";
export const DOMAIN_NAME = "didjyah.com";

export const PRODUCT_LINKS = [
    { href: `https://www.${DOMAIN_NAME}#features`, text: "Features" },
    { href: `https://www.${DOMAIN_NAME}#pricing`, text: "Pricing" },
    { href: `https://www.${DOMAIN_NAME}#hero`, text: "Home" },
    { href: `https://www.${DOMAIN_NAME}#change-log`, text: "Change Log" },
];

export const RESOURCE_LINKS = [
    { href: `https://app.${DOMAIN_NAME}`, text: `App` },
    { href: `https://blog.${DOMAIN_NAME}`, text: `Blog` },
];

export const SOCIAL_LINKS = [
    {
        icon: <BsTwitterX className="h-5 w-5" />,
        href: "https://X.com/didjyah",
    },
    {
        icon: <BsGithub className="h-5 w-5" />,
        href: "https://github.com/didjyah",
    },
    {
        icon: <BsLinkedin className="h-5 w-5" />,
        href: "https://linkedin.com/company/didjyah",
    },
    {
        icon: <BsYoutube className="h-5 w-5" />,
        href: "https://youtube.com/didjyah",
    },
    { icon: <Mail className="h-5 w-5" />, href: `mailto:hello@${DOMAIN_NAME}` },
];
