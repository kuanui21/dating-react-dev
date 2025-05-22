// src/utils/distanceUtils.js
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // 地球半徑 (公里)
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // 距離 (公里)
    return distance;
};

const toRadians = (degrees) => {
    return degrees * Math.PI / 180;
};