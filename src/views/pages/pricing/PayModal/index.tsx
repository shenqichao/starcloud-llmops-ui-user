import React from 'react';

// material-ui
import { CardContent, CardProps, Divider, Grid, IconButton, Modal } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import CloseIcon from '@mui/icons-material/Close';
import { gridSpacing } from 'store/constant';

// generate random
function rand() {
    return Math.round(Math.random() * 20) - 10;
}

// modal position
function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`
    };
}

interface BodyProps extends CardProps {
    modalStyle: React.CSSProperties;
    handleClose: () => void;
    url: string;
}

const Body = React.forwardRef(({ modalStyle, handleClose, url }: BodyProps, ref: React.Ref<HTMLDivElement>) => (
    <div ref={ref} tabIndex={-1}>
        <MainCard
            style={{
                position: 'absolute',
                width: '350px',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
            }}
            title="VIP套餐购买"
            content={false}
            secondary={
                <IconButton onClick={handleClose} size="large" aria-label="close modal">
                    <CloseIcon fontSize="small" />
                </IconButton>
            }
        >
            <CardContent>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} sm={12} md={12}>
                        <div className="flex justify-center flex-col items-center">
                            <div className="text-base mb-2">请扫描下方二维码完成支付</div>
                            <img className="w-[250px] h-[250px]" src={url} alt="" />
                            <div className="text-sm mt-2">二维码将在 10 分钟内失效</div>
                        </div>
                    </Grid>
                </Grid>
            </CardContent>
            <Divider />
        </MainCard>
    </div>
));

// ==============================|| SIMPLE MODAL ||============================== //

export function PayModal({ open, handleClose, url }: { open: boolean; handleClose: () => void; url: string }) {
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);

    return (
        <Grid container justifyContent="flex-end">
            <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
                <Body modalStyle={modalStyle} handleClose={handleClose} url={url} />
            </Modal>
        </Grid>
    );
}
