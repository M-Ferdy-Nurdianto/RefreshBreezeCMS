/**
 * Utility to resolve asset paths correctly regardless of deployment environment.
 * In GitHub Pages, it prepends import.meta.env.BASE_URL (e.g., /RefreshBreezeCMS/).
 * In local dev or root deployments, BASE_URL is likely /.
 * 
 * @param {string} path - The relative path starting from public root (e.g., '/images/logo.webp')
 * @returns {string} - The resolved absolute path
 */
export const getAssetPath = (path) => {
    if (!path) return '';

    // If it's already an external URL or base64, return as is
    if (path.startsWith('http') || path.startsWith('data:')) {
        return path;
    }

    const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, ''); // Remove trailing slash if exists
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    return `${baseUrl}${cleanPath}`;
};
