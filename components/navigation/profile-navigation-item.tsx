import { PersonStandingIcon } from "lucide-react";
import { NavigationItem } from "@/components/navigation/navigation-item";

export function ProfileNavigationItem({ username }: { username?: string }) {
	if (!username) {
		return null;
	}

	return (
		<NavigationItem icon={PersonStandingIcon} href={`/${username}`}>
			{username}
		</NavigationItem>
	);
}
