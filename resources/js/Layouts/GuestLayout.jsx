import ApplicationLogo from "@/Components/ApplicationLogo";
import { useTheme } from "@/ThemeContext";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { Link } from "@inertiajs/react";

export default function Guest({ children }) {
    const { theme, setTheme } = useTheme();

    return (
        <div className={`${theme === true ? "light" : "dark"}  `}>
            <div className="">
                <button className="float-end m-auto">
                    {theme === true ? (
                        <SunIcon className="w-4 h-4" />
                    ) : (
                        <MoonIcon className="w-4 h-4" />
                    )}
                </button>
            </div>
            <div
                className={`min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-gray-900  `}
            >
                <div>
                    <Link href="/">
                        <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                    </Link>
                </div>

                <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
                    {children}
                </div>
            </div>
        </div>
    );
}
