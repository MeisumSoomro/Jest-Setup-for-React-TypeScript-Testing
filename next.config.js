/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'uploadthing.com',
            'utfs.io',
            'img.clerk.com',
            'images.unsplash.com'
        ]
    },
    reactStrictMode: true,
    webpack: (config) => {
        config.module.rules.push({
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto'
        })
        return config
    }
}

module.exports = nextConfig 