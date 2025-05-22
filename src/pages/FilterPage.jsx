import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useIsMobile from "../hooks/useIsMobile.jsx";

import Sidebar from '../components/Sidebar.jsx';
import MobileNavbar from '../components/MobileNavbar.jsx';
import FilterSettings from '../components/FilterSettings.jsx';

import { FilterContext, DEFAULT_MIN_AGE, DEFAULT_MAX_AGE, DEFAULT_DISTANCE } from '../context/FilterContext.jsx';
import mockMatches from '../mocks/matches.json';

function FilterPage() {
    const { ageRange, setAgeRange, searchGender, setSearchGender, maxDistance, setMaxDistance, saveFilterSettings } = useContext(FilterContext);
    const isMobile = useIsMobile();
    const navigate = useNavigate();
    const myId = localStorage.getItem("loginId");
    const myData = mockMatches.find(match => match.id === myId) || null;


    const handleSaveFilterSettings = () => {
        saveFilterSettings(ageRange, searchGender, maxDistance);
        alert('篩選設定已儲存！');
        navigate('/match-feed');
    };

    const mainHeightClass = isMobile ? 'h-[calc(100vh-4rem)]' : 'h-screen';

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar myData={myData} activeTab="filter" />

            <main className={`flex-grow p-5 flex flex-col items-center overflow-y-auto custom-scrollbar box-border ${mainHeightClass}`}>
                <div className="container w-full">
                    <h2 className="text-red-500 text-2xl font-semibold mb-5">篩選設定</h2>
                    <FilterSettings
                        ageRange={ageRange}
                        setAgeRange={setAgeRange}
                        searchGender={searchGender}
                        setSearchGender={setSearchGender}
                        maxDistance={maxDistance}
                        setMaxDistance={setMaxDistance}
                        MIN_AGE={DEFAULT_MIN_AGE}
                        MAX_AGE={DEFAULT_MAX_AGE}
                        maxDistanceLimit={DEFAULT_DISTANCE}
                        onSave={handleSaveFilterSettings}
                        isMobileView={isMobile}
                        onClose={() => navigate('/match-feed')}
                    />
                </div>
            </main>

            {isMobile && <MobileNavbar />}
        </div>
    );
}

export default FilterPage;