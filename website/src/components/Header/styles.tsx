import styled, { css } from 'styled-components';
import { fontFamily } from '../design/typography';
import { darkTheme } from '../design/theme';
import Header from '.';

// export const Wrapper = styled.div`
//     width: 100%;
//     /* padding: 100px 20px 20px 20px; */
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     flex-direction: row;
// `;

export const Logo = styled.h2`
    margin: 0;
    padding: 24px 0px;
    line-height: 2.5rem;
    font-size: 1.2em;
    color: white;
`;

export const FlexNavContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    /* padding: 16px 200px; */
    /* margin-left: 200px; */
    /* width: 100%; */
    position: relative;
    margin: 0px 200px;
    z-index: 99;
`;

export const FLex = styled.div`
    display: flex;
    align-items: center;

    justify-content: space-between;
    flex-wrap: wrap;
    color: white;
`;

export const FlexHeading = styled.div`
    display: flex;
    align-items: center;
`;

export const Button = styled.button`
    border-radius: 8px;
    font-size: 1em;
    font-weight: 600;
    padding: 20px 25px;
    color: #1c0538;
    background-color: white;
    transition: all 0.4s;
    &:hover {
        cursor: pointer;
        transform: scale(1.02);
        background-color: #81ffe8;
    }
    @media (min-width: 320px) {
        font-size: 1.6em;
        font-weight: 600;
        padding: 10px 18px;
    }
    @media (min-width: 425px) {
        font-size: 0.8em;
        font-weight: 600;
        padding: 16px 25px;
    }
    @media (min-width: 800px) {
        font-size: 1em;
        font-weight: 600;
        padding: 16px 20px;
    }
    @media (min-width: 1024px) {
        font-size: 1em;
        font-weight: 600;
        padding: 20px 25px;
    }
`;

export const MenuItemText = styled.div`
    position: relative;
    z-index: 5;
    font-size: 1em;
    transition: all 0.4s;
    &:hover {
        cursor: pointer;
        color: #81ffe8;
    }
`;

// export const FlexNavRight = styled.div`;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
// `;

export const MenuItem = styled.a`
    margin-right: 80px;
    line-height: 0;
    &:nth-last-child(1) {
        margin-right: 0px;
    }
`;
