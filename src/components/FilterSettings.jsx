import { Range, getTrackBackground } from 'react-range';
import RangeSlider from '../components/RangeSlider';

function FilterSettings({
    ageRange,
    setAgeRange,
    searchGender,
    setSearchGender,
    maxDistance,
    setMaxDistance,
    MIN_AGE,
    MAX_AGE,
    maxDistanceLimit
}) {
    console.log()

    const handleAgeRangeChange = (values) => {
        setAgeRange(values);
    };

    const handleMaxDistanceChange = (event) => {
        setMaxDistance(parseInt(event.target.value, 10));
    };

    const handleSave = () => {
        onSave(ageRange, searchGender, maxDistance);
    };

    return (
        <div className="flex flex-col flex-grow">
            {/* 搜尋配對年齡範圍 */}
            <div className="mb-9">
                <label htmlFor="ageRange" className="block font-bold mb-1.5 text-gray-500">年齡:</label>
                <div className="text-left text-lg font-bold">
                    {ageRange[0]} - {ageRange[1] === MAX_AGE ? `${MAX_AGE}+` : ageRange[1]} 歲
                </div>
                {/* RangeSlider 是一個自定義組件，其內部樣式保留在 CSS 中 */}
                <RangeSlider
                    values={ageRange}
                    step={1}
                    min={MIN_AGE}
                    max={MAX_AGE}
                    onChange={handleAgeRangeChange}
                    onSave
                />
            </div>


            {/* 搜尋性別 */}
            <div className="mb-9">
                <label className="block font-bold mb-1.5 text-gray-500">性別:</label>
                <div className="flex gap-1 w-full rounded-lg overflow-hidden border-none">
                    <button
                        type="button"
                        className={`gender-button ${searchGender.female ? 'active' : ''}`}
                        onClick={() => setSearchGender({ male: false, female: true, other: false })}
                    >
                        女性
                    </button>
                    <button
                        type="button"
                        className={`gender-button ${searchGender.male ? 'active' : ''}`}
                        onClick={() => setSearchGender({ male: true, female: false, other: false })}
                    >
                        男性
                    </button>
                    <button
                        type="button"
                        className={`gender-button ${searchGender.male && searchGender.female && !searchGender.other ? 'active' : ''}`}
                        onClick={() => setSearchGender({ male: true, female: true, other: false })}
                    >
                        都可以
                    </button>
                </div>
            </div>

            <div className="mb-9">
                <label htmlFor="maxDistance" className="block font-bold mb-1.5 text-gray-500">距離</label>
                <div className="text-left text-lg font-bold mb-4">
                    最多{maxDistance === maxDistanceLimit ? `${maxDistance}+` : maxDistance}公里遠
                </div>
                <input
                    type="range"
                    id="maxDistance"
                    min="1"
                    max={maxDistanceLimit}
                    value={maxDistance}
                    onChange={handleMaxDistanceChange}
                    className="distance-range-slider w-full mt-2 appearance-none h-1.5 rounded-md outline-none transition-all duration-200 ease"
                    style={{
                        background: getTrackBackground({
                            values: [maxDistance],
                            colors: ['#ff5864', '#ccc'],
                            min: 1,
                            max: maxDistanceLimit
                        }),
                        WebkitAppearance: 'none' // For consistent appearance across browsers
                    }}
                />
            </div>
        </div>
    );
}

export default FilterSettings;