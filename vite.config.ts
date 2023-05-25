import {defineConfig} from 'vite'
import {VitePWA} from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
    plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: false
            },
            includeAssets: [],
            manifest: {
                name: 'Taski todo manager',
                short_name: 'Taski',
                description: 'Task and event manager',
                theme_color: '#ffffff',
                icons: [
                    {
                        src: 'logo/android-chrome-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'logo/android-chrome-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ],
                start_url: "/"
            }
        }),
        react()
    ]
})
