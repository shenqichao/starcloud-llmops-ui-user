export const themesLight = (leves: string, theme: any) => {
    let colors: string = '';
    if (leves === 'free') {
        colors = theme.palette.primary.light;
    } else if (leves === 'plus') {
        colors = theme.palette.secondary.light;
    } else if (leves === 'pro') {
        colors = theme.palette.warning.light;
    }
    return colors;
};
export const themesTwo = (leves: string, theme: any) => {
    let colors: string = '';
    if (leves === 'free') {
        colors = theme.palette.primary[200];
    } else if (leves === 'plus') {
        colors = theme.palette.secondary[200];
    } else if (leves === 'pro') {
        colors = theme.palette.warning.main;
    }
    return colors;
};
export const themesEight = (leves: string, theme: any) => {
    let colors: string = '';
    if (leves === 'free') {
        colors = theme.palette.primary[800];
    } else if (leves === 'plus') {
        colors = theme.palette.secondary[800];
    } else if (leves === 'pro') {
        colors = theme.palette.warning.dark;
    }
    return colors;
};