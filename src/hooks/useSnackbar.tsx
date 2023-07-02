import { useContext } from "react";
import { SnackBarContext } from "../context/snackbar.context";

const useSnackBar = () => {
    const state = useContext(SnackBarContext);
    if (!state) throw Error('PLEASE ADD CONTEXT TO TREE');

    return state;
};

export default useSnackBar;