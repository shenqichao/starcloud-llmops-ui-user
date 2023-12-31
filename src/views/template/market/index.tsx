import { Typography, Grid, Box, FormControl, InputLabel, Select, MenuItem, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import { Outlet, useNavigate } from 'react-router-dom';

import { useState, useEffect } from 'react';

import ScrollMenus from './ScrollMenu';
import { t } from 'hooks/web/useI18n';
import marketStore from 'store/market';
interface MarketList {
    name: string;
    tags: string[];
    createTime: number;
    viewCount: number;
    categories: any;
}
interface Page {
    pageNo: number;
    pageSize: number;
}
function TemplateMarket() {
    const navigate = useNavigate();
    const { total, templateList, newtemplateList, sorllList, setNewTemplate, setSorllList } = marketStore();
    const [page, setPage] = useState<Page>({ pageNo: 1, pageSize: 30 });
    const [queryParams, setQueryParams] = useState({
        name: '',
        sort: '',
        category: ''
    });
    useEffect(() => {
        handleSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryParams]);
    const sortList = [
        { text: t('market.new'), key: 'gmt_create' },
        { text: t('market.popular'), key: 'like' },
        { text: t('market.recommend'), key: 'step' }
    ];
    //更改筛选
    const handleChange = (event: any) => {
        navigate('/appMarket/list');
        const { name, value } = event.target;
        setQueryParams({
            ...queryParams,
            [name]: value
        });
    };
    //当用户更改了筛选触发的逻辑
    const handleSearch = () => {
        let newList = templateList.filter((item: MarketList) => {
            let nameMatch = true;

            if (queryParams.name) {
                nameMatch = item.name?.toLowerCase().includes(queryParams.name.toLowerCase());
            }

            let categoryMatch = true;
            if (queryParams.category) {
                if (queryParams.category === 'ALL') {
                    categoryMatch = true;
                } else {
                    categoryMatch = item.categories?.includes(queryParams.category);
                }
            }
            return nameMatch && categoryMatch;
        });
        if (queryParams.sort && queryParams.sort === 'like') {
            newList.sort((a: MarketList, b: MarketList) => {
                return b.viewCount - a.viewCount;
            });
        }
        if (queryParams.sort && queryParams.sort === 'step') {
            const fristList = newList.filter((item: MarketList) => item.tags?.includes('recommend'));
            const lastList = newList.filter((item: MarketList) => !item.tags?.includes('recommend'));
            newList = [...fristList, ...lastList];
        }
        if (queryParams.sort && queryParams.sort === 'gmt_create') {
            newList.sort((a: MarketList, b: MarketList) => {
                return (b.createTime = a.createTime);
            });
        }
        setPage({
            ...page,
            pageNo: 1
        });
        setNewTemplate(newList);
        setSorllList(newList.slice(0, page.pageSize));
    };
    //页面滚动
    const goodsScroll = (event: any) => {
        const container = event.target;
        const scrollTop = container.scrollTop;
        const clientHeight = container.clientHeight;
        const scrollHeight = container.scrollHeight;
        if (scrollTop + clientHeight >= scrollHeight - 20) {
            if (Math.ceil(newtemplateList.length / page.pageSize) > page.pageNo) {
                setPage((oldValue: Page) => {
                    let newValue = { ...oldValue };
                    newValue.pageNo = newValue.pageNo + 1;
                    setSorllList([
                        ...sorllList,
                        ...newtemplateList.slice(
                            (newValue.pageNo - 1) * newValue.pageSize,
                            (newValue.pageNo - 1) * newValue.pageSize + newValue.pageSize
                        )
                    ]);
                    return newValue;
                });
            }
        }
    };
    //切换category
    const changeCategory = (data: string) => {
        setQueryParams({
            ...queryParams,
            category: data
        });
    };
    return (
        <Box maxWidth="1300px" margin="0 auto" height="calc(100vh - 128px)" overflow="auto" onScroll={goodsScroll}>
            <Typography variant="h1" mt={3} textAlign="center">
                {t('market.title')}
            </Typography>
            <Typography variant="h4" my={2} textAlign="center">
                {t('market.subLeft')} {total} + {t('market.subright')}
            </Typography>
            <Box display="flex" justifyContent="center">
                <TextField
                    id="filled-start-adornment"
                    sx={{ width: '600px' }}
                    placeholder={t('market.place')}
                    name="name"
                    value={queryParams.name}
                    onChange={handleChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        )
                    }}
                />
            </Box>
            <Grid container spacing={2} my={2}>
                <Grid item xs={12} md={10}>
                    <ScrollMenus change={changeCategory} />
                </Grid>
                <Grid item xs={12} md={2}>
                    <FormControl fullWidth>
                        <InputLabel id="sort">{t('market.sortby')}</InputLabel>
                        <Select id="sort" onChange={handleChange} name="sort" value={queryParams.sort} label={t('market.sortby')}>
                            {sortList.map((el: any) => (
                                <MenuItem key={el.key} value={el.key}>
                                    {el.text}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Outlet />
        </Box>
    );
}
export default TemplateMarket;
