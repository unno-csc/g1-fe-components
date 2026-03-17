import { create } from "zustand";

export enum EUserLocalConfigKeys {
    showHelpButton = 'showHelpButton',
}

export interface UserLocalConfigStore {
    showHelpButton: boolean;
    setShowHelpButton: (showHelpButton: boolean) => void;
}


export const useUserLocalConfig = create<UserLocalConfigStore>(set => ({
    showHelpButton: sessionStorage.getItem(EUserLocalConfigKeys.showHelpButton) === 'true',
    setShowHelpButton: (showHelpButton: boolean) => {
        set({ showHelpButton });
        sessionStorage.setItem(EUserLocalConfigKeys.showHelpButton, showHelpButton.toString());
    },
}));



// export const useUserLocalConfig = () => {
//     const [showHelpButton, setShowHelpButton] = useState(false);

//     useEffect(() => {
//         const userConfig = sessionStorage.getItem(EUserLocalConfigKeys.showHelpButton);
//         if (userConfig) setShowHelpButton(userConfig === 'true');
//     }, []);

//     const setShowHelpButtonLocal = () => {
//         const value = !showHelpButton;
//         sessionStorage.setItem(EUserLocalConfigKeys.showHelpButton, value.toString());
//         setShowHelpButton(value);
//     }

//     return {
//         showHelpButton,
//         setShowHelpButtonLocal,
//     };
// }