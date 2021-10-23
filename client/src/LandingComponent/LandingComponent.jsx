import React from 'react'
import "./landingpage.scss"
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

function LandingPage() {
    return (
        <div className="landingpage-container">
            <div className="landingpage-header">
                <h1>Landing Page!</h1>
            </div>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={1} columns={12}>
                <    Grid item xs={12}>
                        <Item>xs=12</Item>
                    </Grid>
                    <Grid item xs={6}>
                        <Item>xs=8</Item>
                    </Grid>
                    <Grid item xs={6}>
                        <Item>xs=8</Item>
                    </Grid>
                    <Grid item xs={4}>
                        <Item>xs=8</Item>
                    </Grid>
                    <Grid item xs={4}>
                        <Item>xs=8</Item>
                    </Grid>
                    <Grid item xs={4}>
                        <Item>xs=8</Item>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}

export default LandingPage
