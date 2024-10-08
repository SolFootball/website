'use client';

import { useState, createContext, useEffect } from 'react';
import { NextUIProvider } from '@nextui-org/react';
import AppWalletProvider from '@/components/providers/AppWalletProvider';
import { UserStatus } from '@/components/types/UserStatus';
import { hasCookie } from 'cookies-next';

export const DarkModeContext = createContext({
	darkMode: true,
	toggleDarkMode: () => {},
});

export const UserStatusContext = createContext({
	userStatus: null as UserStatus | null,
	updateUserStatus: () => {},
});

export function Providers({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [darkMode, setDarkMode] = useState(true);
	const toggleDarkMode = () => {
		setDarkMode((prevTheme) => (prevTheme ? false : true));
	};

	const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
	const updateUserStatus = async () => {
		setUserStatus(await getUserStatus());
	};

	async function getUserStatus() {
		const statusURL = '/api/status';

		try {
			const res = await fetch(statusURL, {
				method: 'GET',
			});

			if (res.ok) {
				console.log('Status received');
				const status: UserStatus = await res.json();
				console.log(
					status.score,
					status.has_betted,
					status.has_account,
				);

				return status;
			} else {
				console.error(
					`Error fetching status: ${res.status}, ${res.statusText}`,
				);
				return null;
			}
		} catch (error) {
			console.error(`Error makingfetching status request: ${error}`);
			return null;
		}
	}

	useEffect(() => {
		const cookieName = process.env.NEXT_PUBLIC_COOKIE;
		if (!cookieName) {
			return;
		}

		if (hasCookie(cookieName)) {
			updateUserStatus();
		}
	}, []);

	return (
		<NextUIProvider className={darkMode ? 'dark' : 'light'}>
			<DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
				<UserStatusContext.Provider
					value={{ userStatus, updateUserStatus }}
				>
					<AppWalletProvider>{children}</AppWalletProvider>
				</UserStatusContext.Provider>
			</DarkModeContext.Provider>
		</NextUIProvider>
	);
}
