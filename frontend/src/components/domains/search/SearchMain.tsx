import React from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../../app/search/search.module.css';
import SearchTourList from './SearchTourList';
import { showAlert } from '../../common/AlertPortal';
import OrderContext from '../../../context/OrderContext';

interface SearchMainProps {
    onDetailsClick: () => void;
    onSearchClick: () => void;
}

const SearchMain: React.FC<SearchMainProps> = ({ onDetailsClick, onSearchClick }) => {
    const router = useRouter();
    const context = React.useContext(OrderContext);

    // context가 없으면 기본값 사용 (렌더링 방어)
    const [orderData, , , , updateCustomerInfo] = context || [{
        products: new Map(),
        options: new Map(),
        totals: { products: 0, options: 0, total: 0, totalCount: 0 },
        productItems: [],
        optionItems: [],
        customerInfo: { name: '', email: '', phone: '' }
    }, () => { }, () => { }, () => { }, () => { }];
    const formData = orderData?.customerInfo || { name: '', email: '' };

    const setFormData = (newInfo: { name: string, email: string }) => {
        if (updateCustomerInfo) updateCustomerInfo({ ...newInfo, phone: formData.phone || '' });
    };

    const cardStyleGrid = styles.cardGrid;

    const validateForm = () => {
        const { name, email } = formData;

        // 1. 빈 필드 체크
        if (!name.trim()) {
            showAlert({
                title: '입력 확인',
                message: '\n성공적인 예약을 위해\n이름을 입력해주세요.',
                type: 'warning'
            });
            return false;
        }
        if (!email.trim()) {
            showAlert({
                title: '입력 확인',
                message: '\n예약 확인 메일을 받을\n이메일 주소를 입력해주세요.',
                type: 'warning'
            });
            return false;
        }

        // 2. 이름 형식 체크 (한글 2자 이상 또는 영문 이름 형식)
        const nameRegex = /^[가-힣]{2,10}$|^[a-zA-Z\s]{2,30}$/;
        if (!nameRegex.test(name)) {
            showAlert({
                title: '형식 오류',
                message: '\n올바른 이름 형식이 아닙니다.\n(한글 2~10자 또는 영문 2~30자)',
                type: 'error'
            });
            return false;
        }

        // 3. 이메일 형식 체크
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showAlert({
                title: '이메일 오류',
                message: '\n유효한 이메일 주소를 입력해주세요.\n(예: example@travel.com)',
                type: 'error'
            });
            return false;
        }

        return true;
    };

    const handleBooking = () => {
        if (validateForm()) {
            router.push('/payment');
        }
    };

    return (
        <div style={{ width: '100%' }}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <h2 className={styles.heroTitle}>모두를 위한 여행 상품</h2>
                    <p className={styles.heroSubtitle}>당신의 완벽한 여행을 찾으세요. 다양한 여행 상품들을 확인하고 예약하세요!</p>
                    <div className={styles.heroButtons}>
                        <div className={styles.btnOutline}>회원가입</div>
                        <div className={styles.btnSolid} onClick={onSearchClick}>지금 탐색하기</div>
                    </div>
                </div>
            </section>

            {/* Recommended Section */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>추천 여행 상품</h2>
                    <p className={styles.sectionSubtitle}>최고의 여행지를 확인해보세요!</p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div
                            className={styles.btnSolid}
                            style={{ width: 'auto', padding: '12px 24px', cursor: 'pointer' }}
                            onClick={onDetailsClick}
                        >
                            자세히 보기
                        </div>
                    </div>
                </div>

                <div className={cardStyleGrid} style={{ display: 'block', gridTemplateColumns: 'none' }}>
                    <SearchTourList category="추천 여행" maxItems={3} isCompact={true} />
                </div>
            </section>

            {/* Booking Form Section */}
            <section className={styles.section}>
                <div style={{ display: 'flex', gap: '80px', width: '100%', maxWidth: '1100px', alignItems: 'flex-start' }}>
                    <div style={{ flex: '1', minWidth: '300px' }}>
                        <h2 className={styles.sectionTitle} style={{ textAlign: 'left', wordBreak: 'keep-all' }}>여행 상품 예약 하기</h2>
                        <p className={styles.sectionSubtitle} style={{ textAlign: 'left' }}>원하는 여행 상품을 선택하고 예약을 진행하세요.</p>
                    </div>
                    <div className={styles.bookingForm}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>이름 (Name)</label>
                            <input
                                className={styles.input}
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="예: 홍길동 또는 Gildong Hong"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>이메일 (Email)</label>
                            <input
                                className={styles.input}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="example@travel.com"
                            />
                        </div>
                        <div className={styles.formButtons}>
                            <div className={styles.btnCancel} onClick={() => setFormData({ name: '', email: '' })}>취소</div>
                            <div
                                className={styles.btnSubmit}
                                onClick={handleBooking}
                                style={{ cursor: 'pointer' }}
                            >
                                예약하기
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SearchMain;
