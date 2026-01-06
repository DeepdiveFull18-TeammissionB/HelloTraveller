import React, { ChangeEvent } from 'react';

interface OptionsProps {
    name: string;
    updateItemCount: (itemName: string, newItemCount: number) => void;
}

const Options: React.FC<OptionsProps> = ({ name, updateItemCount }) => {
    return (
        <form>
            <input
                type="checkbox"
                id={`${name} option`}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    updateItemCount(name, e.target.checked ? 1 : 0);
                }}
            />{" "}
            <label htmlFor={`${name} option`}>{name}</label>
        </form>
    );
};

export default Options;
