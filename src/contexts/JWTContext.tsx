import React, { createContext, useEffect, useReducer } from 'react';

// third-party
import { Chance } from 'chance';
// import jwtDecode from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer';

// project imports
import Loader from 'ui-component/Loader';
import axios from 'utils/axios';

// types
// import { KeyedObject } from 'types';
import { InitialLoginContextProps, JWTContextType } from 'types/auth';

import { getAccessToken } from 'utils/auth';
import useUserStore from 'store/user';
import useRouteStore from 'store/router';

// import * as LoginApi from 'api/login';

const chance = new Chance();

// constant
const initialState: InitialLoginContextProps = {
    isLoggedIn: false,
    isInitialized: false,
    user: null
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //
const JWTContext = createContext<JWTContextType | null>(null);

export const JWTProvider = ({ children }: { children: React.ReactElement }) => {
    const [state, dispatch] = useReducer(accountReducer, initialState);
    const isSetUser = useUserStore((states) => states.isSetUser);
    const setUserInfoAction = useUserStore((states) => states.setUserInfoAction);
    const generateRoutes = useRouteStore((states) => states.generateRoutes);
    const loginOut = useUserStore((states) => states.loginOut);
    // const hasCheckedAuth = useRouteStore((states) => states.hasCheckedAuth);
    // const setHasCheckedAuth = useRouteStore((states) => states.setHasCheckedAuth);

    useEffect(() => {
        const init = async () => {
            try {
                const serviceToken = await getAccessToken();
                if (serviceToken) {
                    if (!isSetUser) {
                        await setUserInfoAction();
                        await generateRoutes();
                    }
                    // setSession(serviceToken);
                    // const response = await axios.get('/api/account/me');
                    // const { user } = response.data;
                    dispatch({
                        type: LOGIN,
                        payload: {
                            isLoggedIn: true,
                            user: null
                        }
                    });
                } else {
                    dispatch({
                        type: LOGOUT
                    });
                }
            } catch (err) {
                console.error(err);
                dispatch({
                    type: LOGOUT
                });
            }
        };

        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = async () => {
        // const response = await axios.post({url: '/api/account/login', { email, password }});
        // const { serviceToken, user } = response.data;
        // setSession(serviceToken);

        const serviceToken = await getAccessToken();
        if (serviceToken) {
            if (!isSetUser) {
                await setUserInfoAction();
                await generateRoutes();
            }
            dispatch({
                type: LOGIN,
                payload: {
                    isLoggedIn: true,
                    user: null
                }
            });
        } else {
            dispatch({
                type: LOGOUT
            });
        }
    };

    const register = async (email: string, password: string, firstName: string, lastName: string) => {
        // todo: this flow need to be recode as it not verified
        const id = chance.bb_pin();
        const response = await axios.post({
            url: '/api/account/register',
            data: {
                id,
                email,
                password,
                firstName,
                lastName
            }
        });
        let users = response.data;

        if (window.localStorage.getItem('users') !== undefined && window.localStorage.getItem('users') !== null) {
            const localUsers = window.localStorage.getItem('users');
            users = [
                ...JSON.parse(localUsers!),
                {
                    id,
                    email,
                    password,
                    name: `${firstName} ${lastName}`
                }
            ];
        }

        window.localStorage.setItem('users', JSON.stringify(users));
    };

    const logout = async () => {
        await loginOut();
        dispatch({ type: LOGOUT });
    };

    const resetPassword = (email: string) => console.log(email);

    const updateProfile = () => {};

    if (state.isInitialized !== undefined && !state.isInitialized) {
        return <Loader />;
    }

    return (
        <JWTContext.Provider value={{ ...state, login, logout, register, resetPassword, updateProfile }}>{children}</JWTContext.Provider>
    );
};

export default JWTContext;
