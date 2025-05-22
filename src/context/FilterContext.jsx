import React, { createContext, useState } from 'react';
import mockMatches from '../mocks/matches.json';

const FilterContext = createContext();

// 常量定義
export const DEFAULT_MIN_AGE = 18;
export const DEFAULT_MAX_AGE = 60;
export const DEFAULT_DISTANCE = 200;
export const DEFAULT_GENDER_SEEKING = { male: true, female: true, other: false };

export const FilterProvider = ({ children }) => {
    const myId = localStorage.getItem("loginId");
    const myData = mockMatches.find(match => match.id === myId) || {}; // 確保 myData 有效

    const [ageRange, setAgeRange] = useState([
        myData?.seeking?.age_range?.min || DEFAULT_MIN_AGE,
        myData?.seeking?.age_range?.max || DEFAULT_MAX_AGE
    ]);
    const [searchGender, setSearchGender] = useState(() => {
        const seekingGender = { ...DEFAULT_GENDER_SEEKING };
        if (myData?.seeking?.gender) {
            if (Array.isArray(myData.seeking.gender)) {
                seekingGender.male = myData.seeking.gender.includes("男性");
                seekingGender.female = myData.seeking.gender.includes("女性");
                seekingGender.other = myData.seeking.gender.includes("其他");
            } else {
                Object.assign(seekingGender, myData.seeking.gender);
            }
        }
        return seekingGender;
    });
    const [maxDistance, setMaxDistance] = useState(myData?.seeking?.maxDistance || DEFAULT_DISTANCE);

    // 儲存篩選設定的函數
    const saveFilterSettings = (newAgeRange, newSearchGender, newMaxDistance) => {
        setAgeRange(newAgeRange);
        setSearchGender(newSearchGender);
        setMaxDistance(newMaxDistance);
        console.log('篩選設定已保存到 Context:', { newAgeRange, newSearchGender, newMaxDistance });
    };

    return (
        <FilterContext.Provider value={{
            ageRange, setAgeRange,
            searchGender, setSearchGender,
            maxDistance, setMaxDistance,
            saveFilterSettings
        }}>
            {children}
        </FilterContext.Provider>
    );
};

export { FilterContext };