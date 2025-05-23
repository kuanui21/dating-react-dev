// src/utils/assetPaths.js
export const getPublicAssetUrl = (path) => {
    // 確保路徑以 '/' 開頭，避免重複斜線
    const normalizedPath = path.startsWith('/') ? path : '/' + path;

    // import.meta.env.BASE_URL 會直接從 vite.config.js 的 base 獲取值
    return import.meta.env.BASE_URL + normalizedPath.substring(1);
};