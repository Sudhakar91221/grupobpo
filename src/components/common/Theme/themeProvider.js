import React, { useContext, useState, useEffect } from 'react';
import SyncStorage from 'sync-storage';
import { Platform } from 'react-native';

import THEMES from './themes.json';


const STORAGE_KEY = 'THEME_ID';
const ThemeContext = React.createContext();

export const ThemeContextProvider = ({ children }) => {
  const [themeID, setThemeID] = useState();

  useEffect(() => {
    (async () => {
      const storedThemeID = await SyncStorage.get(STORAGE_KEY);
      if (storedThemeID) setThemeID(storedThemeID);
      else setThemeID(global.CompanyType);
    })();
  }, []);

  return (
    <ThemeContext.Provider value={{ themeID, setThemeID }}>
      {!!themeID ? children : null}
    </ThemeContext.Provider>
  );
};

export function withTheme(Component) {
  return props => {
    const { themeID, setThemeID } = useContext(ThemeContext);

    const getTheme = themeID => THEMES.find(theme => theme.key === themeID);
    const setTheme = themeID => {
      SyncStorage.set(STORAGE_KEY, themeID);
      setThemeID(themeID);
    };

    return (
      <Component
        {...props}
        themes={THEMES}
        theme={getTheme(themeID)}
        setTheme={setTheme}
      />
    );
  };
}

// export const MediumFont = Platform.select({
//   ios: {
//     fontFamily: "SFProText-Medium",
//   },
//   android: {
//     fontFamily: "sfprotext_medium",
//   },
// }),


export const primaryColor = "#343957"
