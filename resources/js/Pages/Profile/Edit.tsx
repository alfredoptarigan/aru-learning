import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { cn } from "@/lib/utils";
import { User, Lock, Trash2 } from "lucide-react";

type TabType = "profile" | "password" | "delete";

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    const [activeTab, setActiveTab] = useState<TabType>("profile");

    const tabs = [
        { id: "profile", label: "Profile Information", icon: User },
        { id: "password", label: "Update Password", icon: Lock },
        { id: "delete", label: "Delete Account", icon: Trash2 },
    ];

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-3xl font-bold leading-tight text-black font-vt323">
                    Edit Profile
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:px-6 lg:flex-row lg:px-8">
                    {/* Sidebar Tabs */}
                    <aside className="w-full shrink-0 lg:w-64">
                        <nav className="flex flex-col space-y-2">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() =>
                                            setActiveTab(tab.id as TabType)
                                        }
                                        className={cn(
                                            "flex items-center gap-3 border-2 px-4 py-3 text-left font-vt323 text-xl transition-all duration-200",
                                            isActive
                                                ? "border-black bg-primary text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                                : "border-transparent text-gray-600 hover:border-black hover:bg-white hover:text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
                                        )}
                                    >
                                        <tab.icon className="h-5 w-5" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Content Area */}
                    <div className="flex-1">
                        {activeTab === "profile" && (
                            <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:p-8">
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                    className="max-w-xl"
                                />
                            </div>
                        )}

                        {activeTab === "password" && (
                            <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:p-8">
                                <UpdatePasswordForm className="max-w-xl" />
                            </div>
                        )}

                        {activeTab === "delete" && (
                            <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:p-8">
                                <DeleteUserForm className="max-w-xl" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
