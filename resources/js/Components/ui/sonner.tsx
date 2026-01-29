import {
    CircleCheck,
    Info,
    LoaderCircle,
    OctagonX,
    TriangleAlert,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme();

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            position="top-right"
            closeButton
            icons={{
                success: <CircleCheck className="h-4 w-4" />,
                info: <Info className="h-4 w-4" />,
                warning: <TriangleAlert className="h-4 w-4" />,
                error: <OctagonX className="h-4 w-4" />,
                loading: <LoaderCircle className="h-4 w-4 animate-spin" />,
            }}
            toastOptions={{
                classNames: {
                    toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-black group-[.toaster]:border-2 group-[.toaster]:border-black group-[.toaster]:shadow-pixel font-vt323 text-lg data-[type=error]:!bg-red-500 data-[type=error]:!text-white data-[type=error]:!border-red-700 data-[type=success]:!bg-green-500 data-[type=success]:!text-white data-[type=success]:!border-green-700 data-[type=warning]:!bg-yellow-500 data-[type=warning]:!text-black data-[type=warning]:!border-yellow-700",
                    description:
                        "group-[.toast]:text-gray-600 group-data-[type=error]:!text-red-100 group-data-[type=success]:!text-green-100 group-data-[type=warning]:!text-yellow-900",
                    actionButton:
                        "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-vt323",
                    cancelButton:
                        "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground font-vt323",
                    closeButton:
                        "group-[.toast]:bg-white group-[.toast]:text-black group-[.toast]:border-2 group-[.toast]:border-black group-[.toast]:hover:bg-gray-100 font-vt323",
                },
            }}
            {...props}
        />
    );
};

export { Toaster };
