import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage().props.auth.user;

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            phone_number: user.phone_number || '',
            profile_url: null as File | null,
            _method: 'PATCH',
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('profile.update'), {
            forceFormData: true,
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-2xl font-bold text-black font-vt323">
                    Profile Information
                </h2>

                <p className="mt-1 text-lg text-gray-600 font-vt323">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Profile Picture Display & Upload */}
                <div className="flex items-center gap-6">
                    <div className="shrink-0">
                        {user.profile_url ? (
                            <img
                                src={user.profile_url}
                                alt="Current Profile"
                                className="h-20 w-20 border-2 border-black object-cover shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            />
                        ) : (
                            <div className="flex h-20 w-20 items-center justify-center border-2 border-black bg-secondary text-2xl text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    
                    <div className="w-full">
                        <InputLabel htmlFor="profile_url" value="Profile Picture" className="font-vt323 text-xl" />
                        <input
                            id="profile_url"
                            type="file"
                            className="mt-1 block w-full border-2 border-black bg-white p-2 font-vt323 text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] file:mr-4 file:border-2 file:border-black file:bg-secondary file:px-4 file:py-2 file:font-vt323 file:text-white hover:file:bg-secondary/90"
                            onChange={(e) => setData('profile_url', e.target.files ? e.target.files[0] : null)}
                            accept="image/*"
                        />
                        <InputError className="mt-2" message={errors.profile_url} />
                    </div>
                </div>

                {/* Name */}
                <div>
                    <InputLabel htmlFor="name" value="Name" className="font-vt323 text-xl" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full font-vt323 text-lg"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                {/* Phone Number */}
                <div>
                    <InputLabel htmlFor="phone_number" value="Phone Number" className="font-vt323 text-xl" />

                    <TextInput
                        id="phone_number"
                        className="mt-1 block w-full font-vt323 text-lg"
                        value={data.phone_number}
                        onChange={(e) => setData('phone_number', e.target.value)}
                        autoComplete="tel"
                    />

                    <InputError className="mt-2" message={errors.phone_number} />
                </div>

                {/* Email (Disabled) */}
                <div>
                    <InputLabel htmlFor="email" value="Email" className="font-vt323 text-xl" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full bg-gray-100 font-vt323 text-lg text-gray-500 cursor-not-allowed"
                        value={data.email}
                        disabled
                    />
                    <p className="mt-1 text-sm text-gray-500 font-vt323">Email cannot be changed.</p>

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800 font-vt323">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600 font-vt323">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing} className="font-vt323 text-xl">
                        Save Changes
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 font-vt323">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
