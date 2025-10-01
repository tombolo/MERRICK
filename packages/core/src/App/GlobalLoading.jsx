import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import './GlobalLoading.scss';
import LogoImage from './Logo/ANALYTICS.png';

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

    // New color scheme - Modern Minimal
    const colors = {
        primary: '#3B82F6', // Modern blue
        secondary: '#10B981', // Emerald green
        accent: '#8B5CF6', // Violet
        background: '#0F172A', // Dark blue-gray
        surface: '#1E293B', // Slate
        text: '#F8FAFC', // Light gray
    };

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

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

        const marketInterval = setInterval(() => {
            setMarketData({
                eurusd: `1.08${Math.floor(Math.random() * 9)}`,
                btcusd: `${Math.floor(Math.random() * 10) + 60},${Math.floor(Math.random() * 900) + 100}`,
                sp500: `${Math.floor(Math.random() * 100) + 4500}.${Math.floor(Math.random() * 99)}`,
            });
        }, 2000);

        const progressInterval = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + 100 / 120;
                if (newProgress >= 100) {
                    clearInterval(progressInterval);
                    clearInterval(marketInterval);
                }
                return newProgress;
            });
        }, 100);

        setTimeout(() => {
            controls.start('visible');
            setShowElements(true);
        }, 300);

        return () => {
            clearInterval(progressInterval);
            clearInterval(marketInterval);
            window.removeEventListener('resize', checkMobile);
        };
    }, [isMobile]);

    return (
        <div className='modern-loading' ref={containerRef}>
            {/* Abstract Background */}
            <div className='abstract-background'>
                {Array.from({ length: isMobile ? 40 : 60 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className='background-element'
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: [0, 0.4, 0],
                            scale: [0, 1, 0],
                        }}
                        transition={{
                            duration: 3,
                            delay: i * 0.05,
                            repeat: Infinity,
                            repeatDelay: Math.random() * 3,
                        }}
                        style={{
                            left: `${(i % 10) * 10}%`,
                            top: `${Math.floor(i / 10) * 10}%`,
                            background: colors.primary,
                        }}
                    />
                ))}
            </div>

            {/* Floating Lines */}
            <div className='floating-lines'>
                {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className='floating-line'
                        initial={{ y: -100, opacity: 0 }}
                        animate={{
                            y: ['-100%', '200%'],
                            opacity: [0, 0.6, 0],
                        }}
                        transition={{
                            duration: 6 + Math.random() * 4,
                            repeat: Infinity,
                            delay: i * 0.5,
                            ease: 'linear',
                        }}
                        style={{
                            left: `${i * 12}%`,
                            background: `linear-gradient(to bottom, transparent, ${colors.primary}, transparent)`,
                            width: '2px',
                        }}
                    />
                ))}
            </div>

            {/* Geometric Shapes */}
            {[0, 1, 2].map(shape => (
                <motion.div
                    key={shape}
                    className='geometric-shape'
                    animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 15 + shape * 3,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                    style={{
                        border: `1px solid ${colors.secondary}`,
                        opacity: 0.2 - shape * 0.05,
                        borderRadius: shape === 1 ? '50%' : '8px',
                    }}
                />
            ))}

            {/* Main Logo */}
            <motion.div
                className='logo-container'
                initial={{ opacity: 0, scale: 0.8, y: -50 }}
                animate={controls}
                variants={{
                    visible: {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        transition: {
                            duration: 1,
                            ease: 'easeOut',
                        },
                    },
                }}
            >
                <motion.div
                    className='logo-wrapper'
                    animate={{
                        rotateY: [0, 5, 0, -5, 0],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    <div className='logo-frame'>
                        <motion.img
                            src={LogoImage}
                            alt='ANALYTICS'
                            className='logo-image'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        />
                        <div className='logo-glow'></div>
                    </div>
                </motion.div>

                {/* Pulse Effect */}
                <motion.div
                    className='pulse-effect'
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0.6, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeOut',
                    }}
                />
            </motion.div>

            {showElements && (
                <div className='content-wrapper'>
                    {/* Status Panel */}
                    <motion.div
                        className='status-panel'
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                    >
                        <div className='panel-header'>
                            <div className='panel-dots'>
                                <span style={{ background: '#EF4444' }}></span>
                                <span style={{ background: '#F59E0B' }}></span>
                                <span style={{ background: '#10B981' }}></span>
                            </div>
                            <span className='panel-title'>System Status</span>
                            <span className='panel-status'>Active</span>
                        </div>
                        <div className='panel-content'>
                            <motion.div
                                className='status-line'
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                            >
                                <span className='bullet'>•</span> Loading core modules...
                            </motion.div>
                            <motion.div
                                className='status-line'
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.2 }}
                            >
                                <span className='bullet'>•</span> Initializing data streams...
                            </motion.div>
                            <motion.div
                                className='status-line'
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.6 }}
                            >
                                <span className='bullet'>•</span> Preparing analysis...
                            </motion.div>
                            <motion.div
                                className='status-line blinking'
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 2.0 }}
                            >
                                <span className='bullet'>•</span> Ready
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Data Flow Visualization */}
                    <motion.div
                        className='data-flow'
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0, duration: 0.6 }}
                    >
                        <div className='flow-nodes'>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    className='flow-node'
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.4, 1, 0.4],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        delay: i * 0.3,
                                    }}
                                    style={{
                                        background: colors.accent,
                                    }}
                                />
                            ))}
                        </div>
                        <div className='flow-connections'>
                            {Array.from({ length: 8 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    className='connection'
                                    animate={{
                                        scaleX: [0, 1, 0],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                    }}
                                    style={{
                                        background: colors.primary,
                                    }}
                                />
                            ))}
                        </div>
                    </motion.div>

                    {/* Market Data Tiles */}
                    <div className='market-tiles'>
                        <div className='data-tile'>
                            <span className='tile-label'>EUR/USD</span>
                            <motion.span
                                className='tile-value'
                                key={`eurusd-${marketData.eurusd}`}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.4 }}
                            >
                                {marketData.eurusd}
                            </motion.span>
                            <span className='tile-change positive'>+0.08%</span>
                        </div>
                        <div className='data-tile'>
                            <span className='tile-label'>BTC/USD</span>
                            <motion.span
                                className='tile-value'
                                key={`btcusd-${marketData.btcusd}`}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.4 }}
                            >
                                ${marketData.btcusd}
                            </motion.span>
                            <span className='tile-change negative'>-0.92%</span>
                        </div>
                        <div className='data-tile'>
                            <span className='tile-label'>S&P 500</span>
                            <motion.span
                                className='tile-value'
                                key={`sp500-${marketData.sp500}`}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.4 }}
                            >
                                {marketData.sp500}
                            </motion.span>
                            <span className='tile-change positive'>+0.42%</span>
                        </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className='progress-indicator'>
                        <div className='progress-track'>
                            <motion.div
                                className='progress-bar'
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 12, ease: 'easeOut' }}
                            >
                                <div className='progress-shine'></div>
                                <div className='progress-particles'>
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className='progress-particle'
                                            animate={{
                                                x: [0, Math.random() * 80 - 40],
                                                y: [0, Math.random() * 15 - 7],
                                                opacity: [0, 1, 0],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                delay: i * 0.5,
                                            }}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                            <div className='progress-info'>
                                <span className='progress-percent'>{Math.round(progress)}%</span>
                                <span className='progress-label'>Loading analytics engine</span>
                            </div>
                        </div>
                    </div>

                    {/* System Modules */}
                    <div className='system-modules'>
                        {['DATA', 'AI', 'API', 'UI', 'SEC'].map((module, i) => (
                            <motion.div
                                key={i}
                                className='module-chip'
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{
                                    scale: [0, 1, 1, 0],
                                    opacity: [0, 1, 1, 0],
                                }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    delay: i * 0.4,
                                }}
                            >
                                <div className='module-glow'></div>
                                <span>{module}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Loading Message */}
            <motion.div
                className='loading-message'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
            >
                <motion.span
                    animate={{
                        opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                    }}
                >
                    Preparing your analytics dashboard...
                </motion.span>
            </motion.div>

            {/* Loading Bar */}
            <motion.div
                className='loading-bar'
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                    duration: 0.5,
                    delay: 0.3,
                }}
            />
        </div>
    );
};

export default GlobalLoading;
