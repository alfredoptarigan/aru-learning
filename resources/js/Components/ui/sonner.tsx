import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            theme="light"
            className="toaster group font-vt323"
            position="top-right"
            closeButton
            toastOptions={{
                classNames: {
                    toast:
                        'group toast group-[.toaster]:bg-white group-[.toaster]:text-black group-[.toaster]:border-2 group-[.toaster]:border-black group-[.toaster]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]',
                    description: 'group-[.toast]:text-gray-500',
                    actionButton:
                        'group-[.toast]:bg-primary group-[.toast]:text-white',
                    cancelButton:
                        'group-[.toast]:bg-gray-100 group-[.toast]:text-gray-500',
                    closeButton:
                        'group-[.toast]:!bg-white group-[.toast]:!text-black group-[.toast]:!border-2 group-[.toast]:!border-black hover:group-[.toast]:!bg-gray-100',
                    error: 'group-[.toaster]:!bg-destructive group-[.toaster]:!text-white group-[.toaster]:!border-black',
                    success: 'group-[.toaster]:!bg-[#2ecc71] group-[.toaster]:!text-white group-[.toaster]:!border-black',
                    warning: 'group-[.toaster]:!bg-accent group-[.toaster]:!text-black group-[.toaster]:!border-black',
                    info: 'group-[.toaster]:!bg-secondary group-[.toaster]:!text-white group-[.toaster]:!border-black',
                },
            }}
            {...props}
        />
    );
};

export { Toaster };
