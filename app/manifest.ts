import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Zestfully",
		short_name: "Zestfully",
		description: "Start here, every day",
		start_url: "/home",
		display: "standalone",
		background_color: "#030303",
		theme_color: "#030303",
		icons: [
			{
				src: "/icon-192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/icon-512x512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
	};
}
