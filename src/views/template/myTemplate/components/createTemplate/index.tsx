import { Card, Box, Grid, Link, AppBar, Toolbar, Button, Tab, Tabs } from '@mui/material';
import { getApp } from 'api/template/index';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { executeApp } from 'api/template/fetch';
import Basis from './basis';
import Arrange from './arrange';
import Upload from './upLoad';
import Perform from 'views/template/carryOut/perform';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TabsProps } from 'types';
import { Details, Execute } from 'types/template';
function TabPanel({ children, value, index, ...other }: TabsProps) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Box>{children}</Box>
                </Box>
            )}
        </div>
    );
}
function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}
function CreateDetail() {
    //路由跳转
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const changeData = (data: Execute) => {
        const { stepId, index }: { stepId: string; index: number } = data;
        const newValue = [...loadings];
        newValue[index] = true;
        if (!isAllExecute) {
            setLoadings(newValue);
        } else {
            const value: any[] = [];
            for (let i = index; i < detail.workflowConfig.steps.length; i++) {
                console.log(i);
                value[i] = true;
            }
        }
        setDetail((oldValue) => {
            const newData = {
                ...oldValue,
                workflowConfig: {
                    steps: [
                        ...oldValue.workflowConfig.steps.slice(0, index),
                        data.steps,
                        ...oldValue.workflowConfig.steps.slice(index + 1, oldValue.workflowConfig.steps.length)
                    ]
                }
            };
            const fetchData = async () => {
                let resp: any = await executeApp({
                    appUid: searchParams.get('uid'),
                    stepId: stepId,
                    appReqVO: newData
                });
                const reader = resp.getReader();
                const textDecoder = new TextDecoder();
                while (1) {
                    const { done, value } = await reader.read();
                    if (done) {
                        if (isAllExecute && index < newData.workflowConfig.steps.length - 1) {
                            changeData({
                                index: index + 1,
                                stepId: newData.workflowConfig.steps[index + 1].field,
                                steps: newData.workflowConfig.steps[index + 1]
                            });
                        }
                        break;
                    }
                    const newValue1 = [...loadings];
                    newValue1[index] = false;
                    setLoadings(newValue1);
                    let str = textDecoder.decode(value);
                    // if (str.includes('&error&')) {
                    //     str = '';
                    // } else if (str.includes('&start&')) {
                    //     str = str.split('&start&')[1];
                    // } else if (str.includes('&end&')) {
                    //     str = str.split('&start&')[1].split('&end&')[0];
                    // }
                    setDetail({
                        ...newData,
                        workflowConfig: {
                            steps: [
                                ...newData.workflowConfig.steps.slice(0, index),
                                {
                                    ...newData.workflowConfig.steps[index],
                                    flowStep: {
                                        ...newData.workflowConfig.steps[index].flowStep,
                                        response: {
                                            ...newData.workflowConfig.steps[index].flowStep.response,
                                            answer: str
                                        }
                                    }
                                },
                                ...newData.workflowConfig.steps.slice(index + 1, newData.workflowConfig.steps.length)
                            ]
                        }
                    });
                }
            };
            fetchData();

            return newData;
        });
    };
    const [detail, setDetail] = useState({} as Details);
    const [loadings, setLoadings] = useState<any[]>([]);
    const [isAllExecute, setIsAllExecute] = useState<boolean>(false);
    useEffect(() => {
        getApp({ uid: searchParams.get('uid') as string }).then((res) => {
            setDetail(res);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    //设置name desc
    const setData = (data: any) => {
        setDetail({
            ...detail,
            [data.name]: data.value
        });
    };

    //设置提示词编排步骤的name desc
    const editChange = ({ index, label, value }: { index: number; label: string; value: string }) => {
        setDetail({
            ...detail,
            workflowConfig: {
                steps: [
                    ...detail.workflowConfig.steps.slice(0, index),
                    {
                        ...detail.workflowConfig.steps[index],
                        flowStep: {
                            ...detail.workflowConfig.steps[index].flowStep,
                            [label]: value
                        }
                    },
                    ...detail.workflowConfig.steps.slice(index + 1, detail.workflowConfig.steps.length)
                ]
            }
        });
    };
    //提示词更改
    const basisChange = ({ e, index, i }: any) => {
        setDetail({
            ...detail,
            workflowConfig: {
                steps: [
                    ...detail.workflowConfig.steps.slice(0, index),
                    {
                        ...detail.workflowConfig.steps[index],
                        flowStep: {
                            ...detail.workflowConfig.steps[index].flowStep,
                            variable: {
                                variables: [
                                    ...detail.workflowConfig.steps[index].flowStep.variable.variables.slice(0, i),
                                    {
                                        ...detail.workflowConfig.steps[index].flowStep.variable.variables[i],
                                        value: e.value
                                    },
                                    ...detail.workflowConfig.steps[index].flowStep.variable.variables.slice(
                                        i + 1,
                                        detail.workflowConfig.steps[index].flowStep.variable.variables.length
                                    )
                                ]
                            }
                        }
                    },
                    ...detail.workflowConfig.steps.slice(index + 1, detail.workflowConfig.steps.length)
                ]
            }
        });
    };
    //步骤更改
    const variableChange = ({ e, index, i }: any) => {
        setDetail({
            ...detail,
            workflowConfig: {
                steps: [
                    ...detail.workflowConfig.steps.slice(0, index),
                    {
                        ...detail.workflowConfig.steps[index],
                        variable: {
                            variables: [
                                ...detail.workflowConfig.steps[index].variable.variables.slice(0, i),
                                {
                                    ...detail.workflowConfig.steps[index].variable.variables[i],
                                    value: e.value
                                },
                                ...detail.workflowConfig.steps[index].variable.variables.slice(
                                    i + 1,
                                    detail.workflowConfig.steps[index].variable.variables.length
                                )
                            ]
                        }
                    },
                    ...detail.workflowConfig.steps.slice(index + 1, detail.workflowConfig.steps.length)
                ]
            }
        });
    };
    //tabs
    const [value, setValue] = useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <Card>
            <AppBar sx={{ position: 'relative' }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Button startIcon={<ArrowBackIcon />} color="inherit" onClick={() => navigate('/template/createCenter')}>
                        Back
                    </Button>
                </Toolbar>
            </AppBar>
            <Tabs
                sx={{
                    m: 3,
                    '& a': {
                        minHeight: 'auto',
                        minWidth: 10,
                        py: 1.5,
                        px: 1,
                        mr: 2.2,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    },
                    '& a > svg': {
                        mb: '0px !important',
                        mr: 1.1
                    }
                }}
                value={value}
                variant="scrollable"
                onChange={handleChange}
            >
                <Tab component={Link} label="基础设置" {...a11yProps(0)} />
                <Tab component={Link} label="提示词编排" {...a11yProps(1)} />
                <Tab component={Link} label="应用发布" {...a11yProps(2)} />
            </Tabs>
            <TabPanel value={value} index={0}>
                <Grid container spacing={5}>
                    <Grid item lg={5}>
                        <Basis name={detail.name} desc={detail.description} setValues={setData} />
                    </Grid>
                    <Grid item lg={7}>
                        <Perform
                            config={detail.workflowConfig}
                            changeSon={changeData}
                            loadings={loadings}
                            isallExecute={(flag: boolean) => {
                                setIsAllExecute(flag);
                            }}
                            source="myApp"
                        />
                    </Grid>
                </Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Grid container spacing={5}>
                    <Grid item lg={5}>
                        <Arrange
                            config={detail.workflowConfig}
                            editChange={editChange}
                            variableChange={variableChange}
                            basisChange={basisChange}
                        />
                    </Grid>
                    <Grid item lg={7}>
                        <Perform config={detail.workflowConfig} changeSon={changeData} source="myApp" />
                    </Grid>
                </Grid>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <Upload />
            </TabPanel>
        </Card>
    );
}
export default CreateDetail;
