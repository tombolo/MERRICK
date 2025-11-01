"use client";
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './GlobalLoading.module.scss';

// Import your logo - make sure the path is correct
import LOGO from './Logo/NILOTE.png';

export const GlobalLoading = () => {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);

    // Theme colors
    const colors = {
        primary: '#4F46E5',    // Indigo
        secondary: '#7C3AED',  // Violet
        background: '#0F172A', // Dark blue
        surface: '#1E293B',    // Dark surface
        text: '#F8FAFC',      // Light text
        accent: '#06B6D4',     // Cyan
        gold: '#FFD700',       // Gold for partnership text
        silver: '#C0C0C0'      // Silver for powered by text
    };

    // Text content with different styles
    const loadingTexts = [
        { text: "In partnership with", company: "DERIV", type: "partnership" },
        { text: "Powered by", company: "DERIV", type: "powered" },
        { text: "Make your trading journey", highlight: "easier", type: "journey" }
    ];

    useEffect(() => {
        // Text rotation effect
        const textInterval = setInterval(() => {
            setCurrentTextIndex((prev) => (prev + 1) % loadingTexts.length);
        }, 3000);

        // Smooth progress animation with easing over 15 seconds
        const duration = 15000;
        const startTime = Date.now();
        let animationFrame;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration * 100, 100);
            
            // Custom easing function for natural feel
            const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
            const easedProgress = easeOutQuart(progress / 100) * 100;
            
            setProgress(Math.min(easedProgress, 100));
            
            if (progress < 100) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                // Add a slight delay before completing
                setTimeout(() => setIsComplete(true), 800);
            }
        };
        
        // Start the animation
        animationFrame = requestAnimationFrame(animate);
        
        // Add some random micro-stutters for realism
        const stutterInterval = setInterval(() => {
            if (Math.random() > 0.7) {
                setProgress(prev => Math.max(prev - Math.random() * 0.5, 0));
            }
        }, 200);
        
        return () => {
            cancelAnimationFrame(animationFrame);
            clearInterval(stutterInterval);
            clearInterval(textInterval);
        };
    }, []);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { duration: 0.5 }
        },
        exit: { 
            opacity: 0,
            transition: { duration: 0.5, delay: 0.5 }
        }
    };

    const logoVariants = {
        initial: { scale: 0.9, opacity: 0 },
        animate: { 
            scale: 1,
            opacity: 1,
            y: [0, -15, 0],
            transition: { 
                y: {
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut'
                },
                scale: { duration: 0.5 },
                opacity: { duration: 0.5 }
            }
        }
    };

    const textVariants = {
        enter: { 
            opacity: 0, 
            y: 20,
            scale: 0.95
        },
        center: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1]
            }
        },
        exit: { 
            opacity: 0, 
            y: -20,
            scale: 1.05,
            transition: {
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1]
            }
        }
    };

    const companyVariants = {
        initial: { scale: 1 },
        animate: {
            scale: [1, 1.05, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    // Calculate progress bar width with a minimum of 10% for better visibility
    const progressWidth = Math.max(10, progress);

    const getTextStyle = (type) => {
        switch (type) {
            case 'partnership':
                return styles.partnershipText;
            case 'powered':
                return styles.poweredText;
            case 'journey':
                return styles.journeyText;
            default:
                return styles.defaultText;
        }
    };

    return (
        <AnimatePresence>
            {!isComplete && (
                <motion.div 
                    className={styles.globalLoading}
                    style={{
                        '--primary': colors.primary,
                        '--secondary': colors.secondary,
                        '--background': colors.background,
                        '--surface': colors.surface,
                        '--text': colors.text,
                        '--accent': colors.accent,
                        '--gold': colors.gold,
                        '--silver': colors.silver
                    }}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {/* Animated background elements */}
                    <div className={styles.backgroundElements}>
                        <div className={styles.floatingOrb1} />
                        <div className={styles.floatingOrb2} />
                        <div className={styles.floatingOrb3} />
                    </div>

                    <div className={styles.loadingContainer}>
                        {/* Animated Logo */}
                        <motion.div
                            className={styles.logoContainer}
                            variants={logoVariants}
                            initial="initial"
                            animate="animate"
                        >
                            <img 
                                src={LOGO} 
                                alt="Logo" 
                                className={styles.logo}
                            />
                            {/* Logo glow effect */}
                            <div className={styles.logoGlow} />
                        </motion.div>
                        
                        {/* Animated Text Display */}
                        <div className={styles.textDisplay}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentTextIndex}
                                    className={`${styles.textContainer} ${getTextStyle(loadingTexts[currentTextIndex].type)}`}
                                    variants={textVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                >
                                    {loadingTexts[currentTextIndex].type === 'partnership' && (
                                        <div className={styles.partnershipContent}>
                                            <span className={styles.prefix}>{loadingTexts[currentTextIndex].text}</span>
                                            <motion.span 
                                                className={styles.companyName}
                                                variants={companyVariants}
                                                initial="initial"
                                                animate="animate"
                                            >
                                                {loadingTexts[currentTextIndex].company}
                                            </motion.span>
                                            <div className={styles.partnershipBadge}>PARTNERSHIP</div>
                                        </div>
                                    )}
                                    
                                    {loadingTexts[currentTextIndex].type === 'powered' && (
                                        <div className={styles.poweredContent}>
                                            <span className={styles.prefix}>{loadingTexts[currentTextIndex].text}</span>
                                            <motion.span 
                                                className={styles.techName}
                                                animate={{
                                                    textShadow: [
                                                        '0 0 10px var(--silver)',
                                                        '0 0 20px var(--silver)',
                                                        '0 0 10px var(--silver)'
                                                    ]
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity
                                                }}
                                            >
                                                {loadingTexts[currentTextIndex].company}
                                            </motion.span>
                                        </div>
                                    )}
                                    
                                    {loadingTexts[currentTextIndex].type === 'journey' && (
                                        <div className={styles.journeyContent}>
                                            <span className={styles.journeyText}>{loadingTexts[currentTextIndex].text}</span>
                                            <motion.span 
                                                className={styles.highlightText}
                                                animate={{
                                                    backgroundPosition: ['0%', '100%', '0%'],
                                                    scale: [1, 1.05, 1]
                                                }}
                                                transition={{
                                                    duration: 3,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            >
                                                {loadingTexts[currentTextIndex].highlight}
                                            </motion.span>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className={styles.progressContainer}>
                            <div className={styles.progressBar}>
                                <motion.div 
                                    className={styles.progressFill}
                                    initial={{ width: 0 }}
                                    animate={{ 
                                        width: `${progressWidth}%`,
                                        transition: {
                                            duration: 0.3,
                                            ease: [0.4, 0, 0.2, 1]
                                        }
                                    }}
                                >
                                    <div className={styles.progressTip} />
                                    {/* Progress particles */}
                                    <div className={styles.progressParticles}>
                                        {[...Array(3)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className={styles.particle}
                                                animate={{
                                                    y: [0, -10, 0],
                                                    opacity: [0, 1, 0]
                                                }}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                    delay: i * 0.3,
                                                    ease: "easeOut"
                                                }}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                            <motion.div 
                                className={styles.progressText}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ 
                                    opacity: 1, 
                                    y: 0,
                                    transition: { delay: 0.3 }
                                }}
                            >
                                {Math.round(progress)}%
                                <motion.span 
                                    className={styles.percentSign}
                                    animate={{ 
                                        opacity: [0.6, 1, 0.6],
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{ 
                                        duration: 2, 
                                        repeat: Infinity,
                                        ease: 'easeInOut'
                                    }}
                                >
                                    %
                                </motion.span>
                            </motion.div>
                        </div>

                        {/* Loading Text with Animation */}
                        <motion.div 
                            className={styles.loadingText}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <span className={styles.loadingDots}>
                                <span>.</span>
                                <span>.</span>
                                <span>.</span>
                            </span>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GlobalLoading;