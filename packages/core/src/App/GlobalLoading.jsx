import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import './GlobalLoading.scss';
import LogoImage from './Logo/BRAM.png';

const GlobalLoading = () => {
    const [progress, setProgress] = useState(0);
    const controls = useAnimation();
    const [showElements, setShowElements] = useState(false);
    const [marketData, setMarketData] = useState({
        eurusd: `1.08${Math.floor(Math.random() * 9)}`,
        btcusd: `6${Math.floor(Math.random() * 9000) + 1000}`,
        sp500: `${Math.floor(Math.random() * 100) + 4500}.${Math.floor(Math.random() * 99)}`,
    });
    const [candleData, setCandleData] = useState([]);
    const containerRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check if mobile
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Generate initial candle data
        const generateCandleData = () => {
            const candles = [];
            let baseValue = 100;

            for (let i = 0; i < (isMobile ? 12 : 16); i++) {
                const volatility = 2 + Math.random() * 5;
                const open = baseValue;
                const close = open + (Math.random() - 0.5) * volatility;
                const high = Math.max(open, close) + Math.random() * volatility;
                const low = Math.min(open, close) - Math.random() * volatility;
                const isGrowing = close > open;

                candles.push({ open, high, low, close, isGrowing });
                baseValue = close;
            }

            return candles;
        };

        setCandleData(generateCandleData());

        // Update market data every 2 seconds
        const marketInterval = setInterval(() => {
            setMarketData({
                eurusd: `1.08${Math.floor(Math.random() * 9)}`,
                btcusd: `${Math.floor(Math.random() * 10) + 60},${Math.floor(Math.random() * 900) + 100}`,
                sp500: `${Math.floor(Math.random() * 100) + 4500}.${Math.floor(Math.random() * 99)}`,
            });
        }, 2000);

        // 12 second progress timer
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + 100 / 120; // 12 seconds total
                if (newProgress >= 100) {
                    clearInterval(progressInterval);
                    clearInterval(marketInterval);
                }
                return newProgress;
            });
        }, 100);

        // Animated entrance
        setTimeout(() => {
            controls.start('visible');
            setShowElements(true);
        }, 500);

        return () => {
            clearInterval(progressInterval);
            clearInterval(marketInterval);
            window.removeEventListener('resize', checkMobile);
        };
    }, [isMobile]);

    return (
        <div className='global-loading' ref={containerRef}>
            {/* Simplified grid background */}
            <div className='golden-grid'>
                {Array.from({ length: isMobile ? 36 : 64 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className='grid-line'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.03 }}
                        transition={{ duration: 1, delay: i * 0.02 }}
                    />
                ))}
            </div>

            {/* Simplified animated chart background */}
            <div className='chart-background'>
                {candleData.map((candle, i) => (
                    <motion.div
                        key={i}
                        className='background-candle'
                        initial={{ scaleY: 0, opacity: 0 }}
                        animate={{
                            scaleY: 1,
                            opacity: 0.08,
                            transition: { delay: i * 0.15, duration: 0.5 },
                        }}
                        style={{
                            left: `${i * (isMobile ? 8 : 6)}%`,
                            height: `${candle.high - candle.low}%`,
                            top: `${candle.low}%`,
                            width: isMobile ? '4px' : '6px',
                        }}
                    >
                        <div
                            className={`candle-body ${candle.isGrowing ? 'bullish' : 'bearish'}`}
                            style={{
                                height: `${Math.abs(candle.close - candle.open)}%`,
                                width: isMobile ? '2px' : '4px',
                            }}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Main content */}
            <motion.div
                className='logo-container'
                initial={{ opacity: 0, y: -30, scale: 0.9 }}
                animate={controls}
                variants={{
                    visible: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: {
                            duration: 1,
                            ease: [0.17, 0.67, 0.24, 0.99],
                        },
                    },
                }}
            >
                <motion.div
                    className='logo-wrapper'
                    animate={{
                        rotateY: [0, 360],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                >
                    <motion.div
                        className='logo-image-container'
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            transition: { delay: 0.3, duration: 0.8 },
                        }}
                    >
                        <img src={LogoImage} alt='TRADEALYTICS' className='logo-image' />
                    </motion.div>
                </motion.div>

                <motion.div
                    className='logo-glow'
                    animate={{
                        opacity: [0.2, 0.5, 0.2],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                    }}
                />
            </motion.div>

            {/* Simplified Deriv Partnership */}
            <motion.div
                className='deriv-partnership'
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.6 }}
            >
                <div className='partnership-badge'>
                    <span className='partnership-text'>In Partnership with</span>
                    <span className='deriv-logo'>DERIV</span>
                </div>
            </motion.div>

            {showElements && (
                <div className='content-wrapper'>
                    {/* Simplified Trading terminal */}
                    <motion.div
                        className='trading-terminal'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    >
                        <div className='terminal-header'>
                            <span className='terminal-title'>MARKET_DATA_STREAM</span>
                            <span className='terminal-status'>LIVE</span>
                        </div>
                        <div className='terminal-content'>
                            <motion.div
                                className='terminal-line'
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                            >
                                <span className='prompt'>$</span> Connecting to market data...
                            </motion.div>
                            <motion.div
                                className='terminal-line'
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.8 }}
                            >
                                <span className='prompt'>$</span> Loading trading algorithms...
                            </motion.div>
                            <motion.div
                                className='terminal-line blinking'
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 2.8 }}
                            >
                                <span className='prompt'>$</span> _
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Market data */}
                    <div className='market-data-grid'>
                        <div className='data-card'>
                            <span className='data-label'>EUR/USD</span>
                            <motion.span
                                className='data-value'
                                key={`eurusd-${marketData.eurusd}`}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -10, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {marketData.eurusd}
                            </motion.span>
                            <span className='data-change positive'>+0.12%</span>
                        </div>
                        <div className='data-card'>
                            <span className='data-label'>BTC/USD</span>
                            <motion.span
                                className='data-value'
                                key={`btcusd-${marketData.btcusd}`}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -10, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                ${marketData.btcusd}
                            </motion.span>
                            <span className='data-change negative'>-1.24%</span>
                        </div>
                        <div className='data-card'>
                            <span className='data-label'>S&P 500</span>
                            <motion.span
                                className='data-value'
                                key={`sp500-${marketData.sp500}`}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -10, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {marketData.sp500}
                            </motion.span>
                            <span className='data-change positive'>+0.68%</span>
                        </div>
                    </div>

                    {/* Progress section */}
                    <div className='progress-section'>
                        <div className='progress-container'>
                            <motion.div
                                className='progress-bar'
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 12, ease: 'linear' }}
                            >
                                <div className='progress-glow' />
                            </motion.div>
                            <div className='progress-labels'>
                                <span className='progress-text'>{Math.round(progress)}%</span>
                                <span className='progress-message'>Loading trading dashboard...</span>
                            </div>
                        </div>
                    </div>

                    {/* Powered by Deriv footer */}
                    <motion.div
                        className='powered-by-deriv'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2, duration: 0.6 }}
                    >
                        <div className='powered-by-content'>
                            <span className='powered-by-text'>Powered by</span>
                            <motion.span
                                className='deriv-powered-logo'
                                animate={{
                                    textShadow: [
                                        '0 0 8px rgba(255, 215, 0, 0.5)',
                                        '0 0 15px rgba(255, 215, 0, 0.8)',
                                        '0 0 8px rgba(255, 215, 0, 0.5)'
                                    ],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                }}
                            >
                                DERIV
                            </motion.span>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Status message */}
            <AnimatePresence>
                <motion.div
                    className='status-message'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: 0.8 },
                    }}
                    exit={{ opacity: 0 }}
                >
                    Preparing your trading experience...
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default GlobalLoading;