"use client";

import {
	HomeIcon,
	LogOutIcon,
	Repeat2Icon,
	SettingsIcon,
	TrophyIcon,
	UserCogIcon,
} from "lucide-react";
import { useState } from "react";
import { signOut } from "@/app/auth/auth-actions";
import { MobileHeader } from "@/components/navigation/mobile-header";
import { NavigationItem } from "@/components/navigation/navigation-item";
import { NavigationSection } from "@/components/navigation/navigation-section";
import { ProfileNavigationItem } from "@/components/navigation/profile-navigation-item";
import { SidebarHeader } from "@/components/navigation/sidebar-header";

export default function MainNavigation({ username }: { username?: string }) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const handleNavigation = () => setIsMobileMenuOpen(false);
	const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

	return (
		<>
			<MobileHeader onMenuToggle={toggleMenu} />

			{isMobileMenuOpen && (
				<button
					type="button"
					className="fixed inset-0 bg-black bg-opacity-50 z-60 md:hidden"
					onClick={handleNavigation}
					aria-label="Close menu"
				/>
			)}

			<nav
				className={`
          fixed inset-y-0 left-0 z-65 w-64 bg-background transform transition-transform duration-200 ease-in-out
          md:translate-x-0 md:static md:w-64 border-r border-border
          md:top-0 top-16
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
			>
				<div className="h-full flex flex-col">
					<SidebarHeader
						logoSrc="/icon-192x192.png"
						title="Zestfully"
						href={"/home"}
					/>

					<div className="flex-1 overflow-y-auto py-4 px-4">
						<div className="space-y-6">
							<NavigationSection title="Overview">
								<NavigationItem
									href="/home"
									icon={HomeIcon}
									onNavigate={handleNavigation}
								>
									Home
								</NavigationItem>

								<ProfileNavigationItem username={username} />
							</NavigationSection>

							<NavigationSection title="Manage">
								<NavigationItem
									href="/habits"
									icon={Repeat2Icon}
									onNavigate={handleNavigation}
								>
									Habits
								</NavigationItem>
								<NavigationItem
									href="/milestones"
									icon={TrophyIcon}
									onNavigate={handleNavigation}
								>
									Milestones
								</NavigationItem>
							</NavigationSection>

							<NavigationSection title="Account">
								<NavigationItem
									href="/account"
									icon={UserCogIcon}
									onNavigate={handleNavigation}
									soon
								>
									Account
								</NavigationItem>
								<NavigationItem
									href="/settings"
									icon={SettingsIcon}
									onNavigate={handleNavigation}
									soon
								>
									Settings
								</NavigationItem>
								<NavigationItem icon={LogOutIcon} onClick={() => signOut()}>
									Sign Out
								</NavigationItem>
							</NavigationSection>
						</div>
					</div>
				</div>
			</nav>
		</>
	);
}
