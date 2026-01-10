interface SearchSidebarProps {
    onCategorySelect: (category: string) => void;
    selectedCategory: string;
}

const SearchSidebar: React.FC<SearchSidebarProps> = ({ onCategorySelect, selectedCategory }) => {
    return (
        <aside style={sidebarStyle}>
            {[
                { icon: '🏖️', label: '해변 여행' },
                { icon: '🏞️', label: '산악 여행' },
                { icon: '🏙️', label: '도시 탐방' },
                { icon: '🚴‍♂️', label: '모험 여행' },
                { icon: '✈️', label: '추천 여행' },
            ].map((item, idx) => {
                const isSelected = selectedCategory === item.label;
                return (
                    <div 
                        key={idx} 
                        style={{
                            ...sidebarItemStyle,
                            backgroundColor: isSelected ? 'rgba(0, 0, 0, 0.05)' : 'transparent',
                            borderRight: isSelected ? '3px solid #4F46E5' : '3px solid transparent',
                        }}
                        onClick={() => onCategorySelect(item.label)}
                    >
                        <div style={iconBoxStyle}>{item.icon}</div>
                        <span style={{
                            ...sidebarTextStyle,
                            fontWeight: isSelected ? 700 : 500,
                            color: isSelected ? '#4F46E5' : 'black',
                        }}>{item.label}</span>
                    </div>
                );
            })}
        </aside>
    );
}

const sidebarStyle: React.CSSProperties = {
    width: '220px',
    height: '100%',
    paddingTop: '12px',
    position: 'absolute',
    left: '0px',
    top: '0px',
    background: 'rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 900,
};

const sidebarItemStyle: React.CSSProperties = {
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
};

const iconBoxStyle: React.CSSProperties = {
    width: '24px',
    height: '24px',
    background: 'rgba(0, 0, 0, 0.05)',
    borderRadius: '12px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

const sidebarTextStyle: React.CSSProperties = {
    color: 'black',
    fontSize: '16px',
    fontFamily: 'var(--font-roboto)',
    fontWeight: 500,
};

export default SearchSidebar;