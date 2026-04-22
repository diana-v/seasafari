import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
return {
    background_color: "#FFFFFF",
    description: "Plaukdami su „Sea Safari“ jūs priartėsite prie gamtos ir patirsite nepamirštamus įspūdžius. Mes siūlome du R.I.B. laivus, varomus 300 AG ir 600 AG varikliais, kurių maksimalus greitis siekia net iki 60 mazgų. Patirkite naujus pojūčius su Sea Safari Lietuva!",
    display: "standalone",
    icons: [
        {
            purpose: "maskable",
            sizes: "192x192",
            src: "/icons/maskable_icon.png",
            type: "image/png"
        },
        {
            sizes: "192x192",
            src: "/icons/android-icon-192x192.png",
            type: "image/png"
        },
        {
            sizes: "512x512",
            src: "/icons/android-icon-512x512.png",
            type: "image/png"
        }
    ],
    name: "Sea-Safari Lietuva",
    orientation: "portrait",
    short_name: "Sea-Safari",
    start_url: "/",
    theme_color: "#FFFFFF"
  }
}
