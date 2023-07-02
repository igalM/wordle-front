import { useContext } from "react";
import { SharedContext } from "../context/shared.context";

const useShared = () => {
    const state = useContext(SharedContext);
    if (!state) throw Error('PLEASE ADD CONTEXT TO TREE');

    return state;
}

export default useShared;