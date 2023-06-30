import React, { createContext, useEffect, useReducer } from 'react';

// third-party
// import { Chance } from 'chance';
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
import useAuthorizedStore from 'store/authorize';
import useRouteStore from 'store/router';

// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
// import Button from '@mui/material/Button';
// import { t } from 'hooks/web/useI18n';
// import { Typography, useTheme } from '@mui/material';
import { oriregister } from 'api/login';
// import * as LoginApi from 'api/login';

// const chance = new Chance();

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
    // const [open, setOpen] = useState(false);
    // 获取 zustand 中的状态和函数
    const isUnauthorized = useAuthorizedStore((states) => states.isUnauthorized);
    const resetUnauthorized = useAuthorizedStore((states) => states.resetUnauthorized);
    // const theme = useTheme();

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
    useEffect(() => {
        if (isUnauthorized) {
            logout();
            resetUnauthorized();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUnauthorized]);

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

    const register = async (email: string, password: string, username: string, inviteCode: string) => {
        const response = await oriregister({ email, password, username, inviteCode });
        if (response?.data) {
            let users = [
                {
                    email,
                    password,
                    username,
                    inviteCode
                }
            ];

            if (window.localStorage.getItem('users') !== undefined && window.localStorage.getItem('users') !== null) {
                const localUsers = window.localStorage.getItem('users');
                users = [
                    ...JSON.parse(localUsers!),
                    {
                        email,
                        password,
                        username,
                        inviteCode
                    }
                ];
            }

            window.localStorage.setItem('users', JSON.stringify(users));
        }
        return response;
    };

    const logout = async () => {
        dispatch({ type: LOGOUT });
        await loginOut();
    };

    const forgotPassword = async (email: string) => {
        const response = await axios.post({
            url: 'llm/auth/recover/password',
            data: {
                email
            }
        });
        console.log('response', response);
    };

    const resetPassword = (verificationCode: string, newPassword: string): Promise<{ code: number; data: boolean | null; msg: string }> => {
        return axios.post({
            url: 'llm/auth/change/password',
            data: {
                verificationCode,
                newPassword
            }
        });
    };

    const updateProfile = () => {};

    if (state.isInitialized !== undefined && !state.isInitialized) {
        return <Loader />;
    }

    // const handleClose = () => {
    //     setOpen(false);
    // };

    // const handleConfirm = () => {
    //     setOpen(false);
    //     // 在这里处理确认事件
    //     logout();
    //     resetUnauthorized();
    // };

    return (
        <JWTContext.Provider value={{ ...state, login, logout, register, forgotPassword, resetPassword, updateProfile }}>
            {children}
            {/* <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{ p: 3 }}
            >
                {open && (
                    <>
                        <DialogTitle id="alert-dialog-title">{t('common.confirmTitle')}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <Typography variant="body2" component="span">
                                    {t('sys.api.timeoutMessage')}
                                </Typography>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions sx={{ pr: 2.5 }}>
                            <Button
                                sx={{ color: theme.palette.error.dark, borderColor: theme.palette.error.dark }}
                                onClick={handleClose}
                                color="secondary"
                            >
                                Disagree
                            </Button>
                            <Button variant="contained" size="small" onClick={handleConfirm} autoFocus>
                                Agree
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog> */}
        </JWTContext.Provider>
    );
};

export default JWTContext;
