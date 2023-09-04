import { KEYBOARD_DISPLAY } from '../../consts';
import { UsedKey } from '../../types';
import './Keyboard.css';

type Props = {
    usedKeys: UsedKey[] | null,
}

export default function Keyboard({ usedKeys }: Props) {

    const buttons = KEYBOARD_DISPLAY.map((char) => {
        const usedChar = usedKeys && usedKeys.find(item => item.char === char.toLowerCase());
        if (usedChar) {
            return <button key={char} className={`keyboard-button ${usedChar.bgColor}`}>{char}</button>
        }
        return <button key={char} className="keyboard-button">{char}</button>
    }
    );

    return <div className="keyboard">
        {buttons}
    </div>
}