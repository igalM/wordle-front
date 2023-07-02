import { useContext } from "react";
import { GameContext } from "../context/game.context";

const useGame = () => {
    const state = useContext(GameContext);
    if (!state) throw Error('PLEASE ADD CONTEXT TO TREE');

    return state;
};

export default useGame;