import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
    const [path, setPath] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        if (path) navigate(path);
    }, [path, navigate]);

    return (
        <NavigationContext.Provider value={setPath}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = () => useContext(NavigationContext);
