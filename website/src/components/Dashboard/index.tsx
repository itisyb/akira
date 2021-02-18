import { motion, useTransform, useViewportScroll } from 'framer-motion';
import React from 'react';
import styled from 'styled-components';
import { Button } from '../Header/styles';
import * as SC from './styles';

const Dashboard = () => {
    const [ffLayer, setFfLayer] = React.useState(0);
    const { scrollYProgress } = useViewportScroll();
    const [isShown, setIsShown] = React.useState(false);

    const hide = useTransform(scrollYProgress, [0, 0.9, 1], ['flex', 'flex', 'none']);
    const opac = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, 0]);
    scrollYProgress.onChange((x) => {
        setFfLayer(x > 0.4 ? -1 : 0);
    });

    return (
        <SC.DashboardStyle className="Dashboard" style={{ opacity: opac }}>
            <div className="Background__layer" />
            <SC.NavContainer>
                <SC.NavLayerLeft>
                    <SC.Heading />
                    <SC.Circle />
                </SC.NavLayerLeft>
                <SC.NavLayerRight>
                    <SC.Circle2 />
                    <SC.Heading2 />
                    <SC.SubHeading2 />
                </SC.NavLayerRight>
            </SC.NavContainer>
            <LeftPanel isShown={isShown} />

            <MiddlePanel isShown={isShown} setIsShown={setIsShown} />
            <RightPanel isShown={isShown} />
            <LeftPanelGlass isShown={isShown} />
        </SC.DashboardStyle>
    );
};

const LeftPanel = (props) => {
    const [ffLayer, setFfLayer] = React.useState(0);
    const { scrollYProgress } = useViewportScroll();
    const scaleAnim = useTransform(scrollYProgress, [0, 0.1, 0.4], [0, 0.8, 1]);
    const xPosAnim = useTransform(scrollYProgress, [0, 0.5, 1], [200, 0, 0]);
    const opac = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
    scrollYProgress.onChange((x) => {
        setFfLayer(x > 0.4 ? -1 : 0);
    });

    return (
        <SC.LeftPanelStyle
            style={{
                scale: scaleAnim,
                x: xPosAnim,
                opacity: opac,
            }}
        >
            <SC.HeadingBig></SC.HeadingBig>
            <SC.HeadingBigMain></SC.HeadingBigMain>
            {/* <div className={`headingBig ${props.isShown && 'gradient'}`}></div> */}
            <SC.HeadingBig></SC.HeadingBig>
            <SC.HeadingBig></SC.HeadingBig>
            <SC.HeadingBig></SC.HeadingBig>
            <SC.VoiceChannel>
                <SC.HeadingSmall></SC.HeadingSmall>
                {/* <div className={`headingSmall ${props.isShown && 'gradient'}`}></div> */}
                <SC.Row1>
                    <SC.HeadingSmall />
                    {/* <div className={`headingSmall ${props.isShown && 'gradient'}`}></div> */}
                    <SC.CircleSmall></SC.CircleSmall>
                </SC.Row1>
                <SC.Row2>
                    <SC.HeadingSmall></SC.HeadingSmall>
                    {/* <div className={`headingSmall ${props.isShown && 'gradient'}`}></div> */}
                    <SC.CircleSmall></SC.CircleSmall>
                    <SC.CircleSmall></SC.CircleSmall>
                </SC.Row2>
            </SC.VoiceChannel>
            <SC.VoiceChannel2></SC.VoiceChannel2>
            <SC.VoiceChannel2></SC.VoiceChannel2>
            <SC.VoiceChannel2></SC.VoiceChannel2>
            <SC.Row3>
                <SC.VoiceChannelActive></SC.VoiceChannelActive>
                <SC.CircleActive></SC.CircleActive>
            </SC.Row3>
        </SC.LeftPanelStyle>
    );
};

const LeftPanelGlass = (props) => {
    const [ffLayer, setFfLayer] = React.useState(0);
    const { scrollYProgress } = useViewportScroll();
    const scaleAnim = useTransform(scrollYProgress, [0, 0.1, 0.4], [0, 0.2, 1]);
    const xPosAnim = useTransform(scrollYProgress, [0, 0.1, 0.1], [-300, 0, 0]);
    const zRotAnim = useTransform(scrollYProgress, [0, 0.1, 0.4], [0, 3, 0]);

    scrollYProgress.onChange((x) => {
        setFfLayer(x > 0.4 ? -1 : 0);
    });
    return (
        <SC.LeftPanelGlassStyle
            style={{
                scale: scaleAnim,
                x: xPosAnim,
                rotateZ: zRotAnim,
            }}
        >
            <SC.CircleChannel />
            {/* <div className={`circle1 ${props.isShown && 'gradient'}`}> */}
            <SC.CircleChannelMain>
                <img
                    src="https://i.ibb.co/WFTHSfz/akira.png"
                    alt="akira"
                    style={{ maxHeight: '100%', maxWidth: '100%' }}
                />
            </SC.CircleChannelMain>
            {/* </div> */}
            <SC.CircleChannel />
            <SC.CircleChannel />
            <SC.CircleChannel />
            <SC.CircleChannel />
        </SC.LeftPanelGlassStyle>
    );
};

const MiddlePanel = (props) => {
    const [ffLayer, setFfLayer] = React.useState(0);
    const { scrollYProgress } = useViewportScroll();
    const scaleAnim = useTransform(scrollYProgress, [0, 0.1, 0.4], [0, 0.2, 1]);
    const yPosAnim = useTransform(scrollYProgress, [0, 0.5], [-400, 0]);

    scrollYProgress.onChange((x) => {
        setFfLayer(x > 0.4 ? -1 : 0);
    });

    return (
        <SC.MiddleStyle
            style={{
                scale: scaleAnim,
                y: yPosAnim,
            }}
        >
            <div className="headingSmall"></div>
            <SC.ProfileSkeleton>
                <SC.ProfileCircle />
                <div className="data-skeleton">
                    <SC.Text />
                    <SC.Text />
                </div>
            </SC.ProfileSkeleton>
            <SC.Box>
                <SC.ProfileSkeleton>
                    <div className="profile-square "></div>
                    <div className="data-skeleton">
                        <SC.Text2></SC.Text2>
                        <SC.Text2></SC.Text2>
                        {/* <div className={`text2 ${props.isShown && 'gradient'}`}></div> */}
                    </div>
                    <SC.JoinButton
                        bg="#56EEAE"
                        // className={`button__color ${props.isShown && 'gradient'}`}
                        onMouseEnter={() => props.setIsShown(true)}
                        onMouseLeave={() => props.setIsShown(false)}
                    >
                        Join
                    </SC.JoinButton>
                </SC.ProfileSkeleton>
            </SC.Box>
            <SC.ProfileSkeleton>
                <SC.ProfileCircle></SC.ProfileCircle>
                <div className="data-skeleton">
                    <SC.Text></SC.Text>
                    <SC.Text></SC.Text>
                </div>
            </SC.ProfileSkeleton>

            <SC.ProfileSkeleton>
                <SC.ProfileCircle></SC.ProfileCircle>
                <div className="data-skeleton">
                    <SC.Text></SC.Text>
                    <SC.Text></SC.Text>
                </div>
            </SC.ProfileSkeleton>

            <SC.ProfileSkeleton>
                <SC.ProfileCircle></SC.ProfileCircle>
                <div className="data-skeleton">
                    <SC.Text></SC.Text>
                    <SC.Text></SC.Text>
                </div>
            </SC.ProfileSkeleton>

            <SC.ProfileSkeleton>
                <SC.ProfileCircle></SC.ProfileCircle>
                <div className="data-skeleton">
                    <SC.Text></SC.Text>
                    <SC.Text></SC.Text>
                </div>
            </SC.ProfileSkeleton>
        </SC.MiddleStyle>
    );
};

const ProfileSkeleton = (props) => {
    return (
        <SC.ProfileSkeletonRight>
            <SC.ProfileCircle>
                <SC.ProfileStatus inputColor={props.inputColor} />
            </SC.ProfileCircle>
            <div className="data-skeleton">
                <SC.Text3 />
                <SC.Text3 />
            </div>
        </SC.ProfileSkeletonRight>
    );
};

const RightPanel = (props) => {
    const [ffLayer, setFfLayer] = React.useState(0);
    const { scrollYProgress } = useViewportScroll();
    const scaleAnim = useTransform(scrollYProgress, [0, 0.1, 0.4], [0, 0.2, 1]);
    const xPosAnim = useTransform(scrollYProgress, [0, 0.5, 1], [200, 0, 0]);
    const zRotAnim = useTransform(scrollYProgress, [0, 0.1, 0.4], [0, 6, 0]);

    scrollYProgress.onChange((x) => {
        setFfLayer(x > 0.4 ? -1 : 0);
    });

    return (
        <SC.RightPanelStyle
            style={{
                scale: scaleAnim,
                x: xPosAnim,
                rotateZ: zRotAnim,
            }}
        >
            {console.log(scaleAnim)}
            <SC.HeadingSmallRight />
            <ProfileSkeleton isShown1={props.isShown} />
            <ProfileSkeleton isShown2={props.isShown} />
            <ProfileSkeleton isShown1={props.isShown} />
            <ProfileSkeleton inputColor="#FFE485" isShown1={props.isShown} />
            <ProfileSkeleton inputColor="#EE5656" isShown2={props.isShown} />
            <ProfileSkeleton isShown1={props.isShown} />
            <ProfileSkeleton inputColor="#FFE485" isShown2={props.isShown} />
            <ProfileSkeleton inputColor="#EE5656" isShown1={props.isShown} />
        </SC.RightPanelStyle>
    );
};

export default Dashboard;
