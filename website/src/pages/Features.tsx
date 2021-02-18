import { motion, useTransform, useViewportScroll } from 'framer-motion';
import React from 'react';
import styled from 'styled-components';

const FeaturesWrapper = styled(motion.div)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0 20vw;
    height: 100vh;
    @media (max-width: 800px) {
        padding: 0px;
    }
    @media (max-width: 1024px) {
        flex-direction: column;
        align-items: flex-start;
        text-align: center;
        padding: 0 80px;
    }
`;
const FeatureTextContainer = styled.div`
    width: 50%;
    padding-right: 4vw;
    @media (max-width: 800px) {
        width: 100%;
        padding-right: 0;
    }
`;

const FeatureImageContainer = styled.div`
    width: 50%;
    @media (max-width: 800px) {
        width: 100%;
    }
`;

const Heading = styled.h2`
    font-size: 2.5em;
    padding-right: 4vw;
    @media (max-width: 800px) {
        text-align: left;
    }
    @media (max-width: 1024px) {
        font-size: 3em;
        padding: 0px;
        text-align: left;
    }
`;
const Paragraph = styled.p`
    font-size: 1.1em;
    text-align: left;
    margin-top: 16px;
    padding: 0 80px 0 0;
    @media (max-width: 1024px) {
        padding: 0;
        font-size: 1.4em;
    }
`;

const Features = () => {
    const [ffLayer, setFfLayer] = React.useState(0);
    const { scrollYProgress } = useViewportScroll();
    const opac = useTransform(scrollYProgress, [0, 0.9, 1], [0, 0, 1]);

    scrollYProgress.onChange((x) => {
        setFfLayer(x > 0.4 ? -1 : 0);
    });

    return (
        <FeaturesWrapper
            style={{
                opacity: opac,
            }}
        >
            <FeatureTextContainer>
                <Heading>
                    Unlimited potentials with
                    <tspan style={{ color: '#81FFE8' }}> unique features </tspan>
                </Heading>
                <Paragraph>
                    The Akira Dashboard gives you full control to create the command of your dreams! Create commands
                    that automatically give and remove roles and send messages in the current channel or in DM.
                </Paragraph>
            </FeatureTextContainer>
            <FeatureImageContainer>
                <img
                    //   src="https://i.ibb.co/txCs4dc/cda48f8169e3308c81af7e5ad8c46834.png"
                    src="https://i.ibb.co/68GKdzk/Group-17.png"
                    alt="feature"
                    style={{ width: '80%' }}
                ></img>
            </FeatureImageContainer>
        </FeaturesWrapper>
    );
};

export default Features;
