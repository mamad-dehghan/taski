import {defineConfig} from 'vite'
import {VitePWA} from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
    server: {
        port: 9119,
        open: '/dashboard/setting',
        // https:true
    },
    esbuild: {
        supported: {
            'top-level-await': true
        }
    },
    plugins: [
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true
            },
            includeAssets: ['favicon.ico'],
            manifest: {
                name: 'Taski',
                short_name: 'Taski',
                description: 'A Fantastic todo list',
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
                "start_url": "/"
            }
        }),
        react()
    ]
})
