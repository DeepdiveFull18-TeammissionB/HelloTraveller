import React, { useState, ChangeEvent, FormEvent } from 'react';

const SummaryPage: React.FC = () => {
    const [checked, setChecked] = useState<boolean>(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // 주문 확인 로직
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="checkbox"
                    checked={checked}
                    id="confirm-checkbox"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setChecked(e.target.checked)}
                />{" "}
                <label htmlFor="confirm-checkbox">
                    주문하려는 것을 확인하셨나요?
                </label>
                <br />
                <button disabled={!checked} type="submit">
                    주문 확인
                </button>
            </form>
        </div>
    );
};

export default SummaryPage;
