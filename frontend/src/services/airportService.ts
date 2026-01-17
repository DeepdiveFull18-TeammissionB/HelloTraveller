export interface Airport {
    code: string;
    name: string;
}

export interface RouteInfo {
    departure: Airport;
    destination: Airport;
    isLocalActivity: boolean; // Flag to indicate if it's a local activity (no flight needed)
}

const AIRPORTS: Record<string, Airport> = {
    ICN: { code: 'ICN', name: '인천국제공항' },
    PUS: { code: 'PUS', name: '김해국제공항' },
    CJU: { code: 'CJU', name: '제주국제공항' },
    GMP: { code: 'GMP', name: '김포국제공항' },
    // Destinations
    BCN: { code: 'BCN', name: '바르셀로나 엘프라트 공항' },
    CDG: { code: 'CDG', name: '샤를 드 골 공항' },
    LHR: { code: 'LHR', name: '히드로 공항' },
    FCO: { code: 'FCO', name: '레오나르도 다 빈치 공항' },
    JFK: { code: 'JFK', name: '존 F. 케네디 공항' },
    KIX: { code: 'KIX', name: '간사이 국제공항' },
    NRT: { code: 'NRT', name: '나리타 국제공항' },
    BKK: { code: 'BKK', name: '수완나품 공항' },
    DAD: { code: 'DAD', name: '다낭 국제공항' },
    // Local / Dummy
    LOCAL: { code: 'LOCAL', name: '현지 이동' },
    DEST: { code: 'DEST', name: '현지 공항' }
};

const LONG_HAUL_KEYWORDS = ['barcelona', 'paris', 'london', 'rome', 'new york', 'europe', 'usa'];
const LOCAL_KEYWORDS = ['bukchon', 'seoul', 'korea', 'palace', 'hanok', 'market'];
const DOMESTIC_KEYWORDS = ['jeju', 'busan'];

export const getRouteInfo = (productName: string, userRegion: string = 'Seoul'): RouteInfo => {
    const nameLower = productName.toLowerCase();

    // 1. Check for Local Activity (No Flight)
    if (LOCAL_KEYWORDS.some(k => nameLower.includes(k))) {
        return {
            departure: AIRPORTS['LOCAL'],
            destination: AIRPORTS['LOCAL'],
            isLocalActivity: true
        };
    }

    // 2. Check for Domestic Flight (e.g. Jeju)
    if (DOMESTIC_KEYWORDS.some(k => nameLower.includes(k))) {
        let dep = 'GMP'; // Default domestic departure from Seoul
        let dest = 'CJU'; // Default domestic destination (Jeju)

        if (nameLower.includes('busan')) dest = 'PUS';

        if (userRegion === 'Busan') dep = 'PUS'; // Busan to Jeju
        else if (userRegion === 'Jeju') dep = 'CJU'; // Jeju to Busan/Seoul

        return {
            departure: AIRPORTS[dep] || AIRPORTS['GMP'],
            destination: AIRPORTS[dest] || AIRPORTS['CJU'],
            isLocalActivity: false
        };
    }

    // 3. International Flight Logic
    let destCode = 'DEST';
    if (nameLower.includes('barcelona')) destCode = 'BCN';
    else if (nameLower.includes('paris')) destCode = 'CDG';
    else if (nameLower.includes('london')) destCode = 'LHR';
    else if (nameLower.includes('rome')) destCode = 'FCO';
    else if (nameLower.includes('new york')) destCode = 'JFK';
    else if (nameLower.includes('osaka')) destCode = 'KIX';
    else if (nameLower.includes('tokyo')) destCode = 'NRT';
    else if (nameLower.includes('bangkok')) destCode = 'BKK';
    else if (nameLower.includes('danang')) destCode = 'DAD';

    const destination = AIRPORTS[destCode] || AIRPORTS['DEST'];

    let depCode = 'ICN';
    const isLongHaul = LONG_HAUL_KEYWORDS.some(k => nameLower.includes(k));

    if (isLongHaul) {
        depCode = 'ICN';
    } else {
        if (userRegion === 'Busan') depCode = 'PUS';
        else if (userRegion === 'Jeju') depCode = 'CJU';
        else depCode = 'ICN';
    }

    return {
        departure: AIRPORTS[depCode],
        destination: destination,
        isLocalActivity: false
    };
};
