import React, { useEffect } from 'react';
// import Dashboard from '../components/dashboard';
import Header from '../components/Header';
import { motion, useViewportScroll, useTransform } from 'framer-motion';
import styled from 'styled-components';
import Dashboard from '../components/Dashboard';
import Features from './Features';
import { Button } from '../components/Header/styles';

export function Scroll() {
    useEffect(function mount() {
        function onScroll() {
            console.log('scroll!');
        }

        window.addEventListener('scroll', onScroll);

        return function unMount() {
            window.removeEventListener('scroll', onScroll);
        };
    });

    return null;
}

const SceneStyle = styled.div`
    height: 100vh;
    background-image: linear-gradient(#1c0538, #090312);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 100%;
    top: 0;
`;

const HeroContainerStyle = styled.div`
    height: 100vh;
    width: 100%;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
`;

const Heading = styled.h1`
    font-size: 4.5em;
    line-height: 1.1;
    text-align: center;
    font-weight: 900;
    color: white;
    @media (max-width: 425px) {
        font-size: 3em;
    }
    @media (min-width: 425px) {
        font-size: 3.8em;
    }
    @media (min-width: 1024px) {
        font-size: 4.5em;
    }
`;

const Subheading = styled.p`
    font-size: 1.6em;
    line-height: 1;
    text-align: center;
    font-weight: 600;
    color: white;
    margin-bottom: -3vh;

    @media (max-width: 800px) {
        font-size: 1.4em;
        margin-bottom: -2vh;
    }
    @media only screen and (min-width: 800px) and (max-width: 1024px) {
        font-size: 1.6em;
        margin-bottom: -2vh;
    }
`;

const ImageContainer = styled.img`
    display: flex;
    align-items: center;
    max-height: 100%;
    width: 50%;
    margin: auto;
    bottom: 0;
    position: absolute;
    @media (max-width: 425px) {
        width: 50%;
    }
    @media (max-width: 800px) {
        width: 80%;
    }
    @media (max-width: 1024px) {
        width: 60%;
    }
`;

const Hero_heading = styled(motion.div)`
    @media (min-width: 425px) {
        margin-top: 18vh;
    }
    @media only screen and (min-width: 800px) and (max-width: 1024px) {
        margin-top: 16vh;
    }
`;

// const isBrowser = () => typeof window !== 'undefined';

const Hero = () => {
    const [ffLayer, setFfLayer] = React.useState(0);
    const { scrollYProgress } = useViewportScroll();
    const yPosAnim = useTransform(scrollYProgress, [0, 0.2], [0, 200]);

    const opac = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
    scrollYProgress.onChange((x) => {
        setFfLayer(x > 0.4 ? -1 : 0);
    });

    useEffect(function mount() {
        function onScroll() {
            console.log('scroll!');
            console.log(yPosAnim.get());
            if (Math.round(yPosAnim.get()) >= 1 && Math.round(yPosAnim.get()) <= 2) {
                console.log('scroll!>>>>>>');

                window.scrollTo(0, 1500);
            }
        }

        window.addEventListener('scroll', onScroll);

        return function unMount() {
            window.removeEventListener('scroll', onScroll);
        };
    }, []);

    // useEffect(() => {
    //     console.log(yPosAnim.get());
    //     if (Math.round(yPosAnim.get()) >= 1 && Math.round(yPosAnim.get()) <= 2) {
    //         console.log(yPosAnim.get());
    //         console.log('scroll!>>>>>>');
    //         window.scrollTo(0, 1500);
    //     }
    //     // return () => {
    //     //     ;
    //     // };
    // }, []);

    // do {
    //     window.scrollTo(0, 1500);
    // } while (yPosAnim.get() == 0.01);

    return (
        <>
            <Header />
            {/* <Scroll /> */}
            <div className="scene" style={{ height: '300vh' }}>
                <SceneStyle>
                    <Dashboard />

                    <motion.div
                        className="Hero__wrapper"
                        style={{
                            y: yPosAnim,

                            // opacity: opac,
                        }}
                    >
                        <HeroContainerStyle>
                            <motion.div className="Hero__container">
                                <Hero_heading>
                                    <Subheading>Javascript Bot</Subheading>
                                    <Heading>
                                        A Multipurpose<br></br>
                                        <tspan style={{ color: '#81FFE8' }}>Discord</tspan> Bot
                                    </Heading>
                                </Hero_heading>
                            </motion.div>
                            {/* <Button onClick={() => window.scrollTo(0, 1500)}>Let's Roll</Button> */}
                            <ImageContainer
                                className="image__container"
                                src="https://i.ibb.co/WFTHSfz/akira.png"
                                alt="akira"
                            />
                        </HeroContainerStyle>
                    </motion.div>
                </SceneStyle>
            </div>
            <Features />
        </>
    );
};

export default Hero;
