import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import Text from '../text/text';

export type TLoadingProps = React.HTMLProps<HTMLDivElement> & {
    is_fullscreen: boolean;
    is_slow_loading: boolean;
    status: string[];
    theme: string;
    progress?: number;
    showPercentage?: boolean;
};

const Loading = ({ className, id, is_fullscreen = true, is_slow_loading, status, theme, progress, showPercentage = true }: Partial<TLoadingProps>) => {
    const [currentProgress, setCurrentProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Geometric wave animation
    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        let time = 0;
        const shapes: Array<{
            x: number;
            y: number;
            size: number;
            speed: number;
            type: 'circle' | 'triangle' | 'square';
            color: string;
        }> = [];

        // Create geometric shapes
        const colors = [
            'rgba(74, 144, 226, 0.6)',  // Blue
            'rgba(65, 184, 131, 0.6)',  // Green
            'rgba(229, 89, 52, 0.6)',   // Orange
            'rgba(150, 94, 210, 0.6)',  // Purple
        ];

        for (let i = 0; i < 15; i++) {
            shapes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 20 + 10,
                speed: Math.random() * 0.02 + 0.01,
                type: ['circle', 'triangle', 'square'][Math.floor(Math.random() * 3)] as 'circle' | 'triangle' | 'square',
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        const drawShape = (shape: typeof shapes[0]) => {
            ctx.fillStyle = shape.color;
            ctx.strokeStyle = shape.color;
            ctx.lineWidth = 2;

            switch (shape.type) {
                case 'circle':
                    ctx.beginPath();
                    ctx.arc(shape.x, shape.y, shape.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 'triangle':
                    ctx.beginPath();
                    ctx.moveTo(shape.x, shape.y - shape.size / 2);
                    ctx.lineTo(shape.x - shape.size / 2, shape.y + shape.size / 2);
                    ctx.lineTo(shape.x + shape.size / 2, shape.y + shape.size / 2);
                    ctx.closePath();
                    ctx.fill();
                    break;
                case 'square':
                    ctx.fillRect(shape.x - shape.size / 2, shape.y - shape.size / 2, shape.size, shape.size);
                    break;
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            time += 0.01;

            shapes.forEach((shape, index) => {
                // Move shapes in wave pattern
                shape.x += Math.sin(time + index) * 0.5;
                shape.y += Math.cos(time * 0.7 + index) * 0.5;

                // Wrap around edges
                if (shape.x < -shape.size) shape.x = canvas.width + shape.size;
                if (shape.x > canvas.width + shape.size) shape.x = -shape.size;
                if (shape.y < -shape.size) shape.y = canvas.height + shape.size;
                if (shape.y > canvas.height + shape.size) shape.y = -shape.size;

                drawShape(shape);
            });

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    useEffect(() => {
        if (progress !== undefined) {
            setCurrentProgress(progress);
            if (progress >= 100) {
                setTimeout(() => setIsComplete(true), 500);
            }
        } else {
            const interval = setInterval(() => {
                setCurrentProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => setIsComplete(true), 500);
                        return 100;
                    }
                    return Math.min(100, prev + Math.random() * (100 - prev) * 0.1 + 1);
                });
            }, 200);

            return () => clearInterval(interval);
        }
    }, [progress]);

    // Status message cycling
    const [displayedStatus, setDisplayedStatus] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (status && status.length > 0) {
            setIsTyping(true);
            setDisplayedStatus('');

            const currentStatus = status[currentStatusIndex];
            let charIndex = 0;

            const typeInterval = setInterval(() => {
                if (charIndex <= currentStatus.length) {
                    setDisplayedStatus(currentStatus.slice(0, charIndex));
                    charIndex++;
                } else {
                    setIsTyping(false);
                    clearInterval(typeInterval);

                    setTimeout(() => {
                        setCurrentStatusIndex(prev => (prev + 1) % status.length);
                    }, 2500);
                }
            }, 40);

            return () => clearInterval(typeInterval);
        }
    }, [status, currentStatusIndex]);

    const displayProgress = progress !== undefined ? progress : currentProgress;

    return (
        <div
            data-testid='dt_initial_loader'
            className={classNames('geo-loading', className, {
                'geo-loading--fullscreen': is_fullscreen,
                'geo-loading--complete': isComplete,
                'geo-loading--slow': is_slow_loading,
            })}
            id={id}
        >
            {/* Geometric background canvas */}
            <canvas
                ref={canvasRef}
                className="geo-loading__canvas"
            />

            {/* Main loading container */}
            <div className='geo-loading__container'>
                {/* Modular progress indicator */}
                <div className='geo-loading__modular-grid'>
                    {[...Array(25)].map((_, index) => {
                        const progressPerCell = 100 / 25;
                        const cellProgress = Math.max(0, Math.min(100, (displayProgress - (index * progressPerCell)) * (100 / progressPerCell)));

                        return (
                            <div
                                key={index}
                                className='geo-loading__grid-cell'
                                style={{
                                    '--cell-progress': `${cellProgress}%`
                                } as React.CSSProperties}
                            >
                                <div className='geo-loading__cell-fill' />
                            </div>
                        );
                    })}
                </div>

                {/* Central progress display */}
                <div className='geo-loading__progress-display'>
                    {showPercentage && (
                        <div className='geo-loading__percentage'>
                            <span className='geo-loading__percentage-number'>
                                {Math.round(displayProgress)}
                            </span>
                            <span className='geo-loading__percentage-symbol'>%</span>
                        </div>
                    )}

                    {/* Rotating geometric element */}
                    <div className='geo-loading__spinner'>
                        <div className='geo-loading__spinner-inner'>
                            <div className='geo-loading__spinner-element geo-loading__spinner-element--1' />
                            <div className='geo-loading__spinner-element geo-loading__spinner-element--2' />
                            <div className='geo-loading__spinner-element geo-loading__spinner-element--3' />
                        </div>
                    </div>
                </div>

                {/* Status text */}
                {status && status.length > 0 && (
                    <div className='geo-loading__status'>
                        <Text size='m' color='prominent' className='geo-loading__status-text'>
                            {displayedStatus}
                            <span className={`geo-loading__cursor ${isTyping ? 'typing' : 'blinking'}`}>
                                |
                            </span>
                        </Text>
                    </div>
                )}

                {/* Progress bar */}
                <div className='geo-loading__progress-bar'>
                    <div
                        className='geo-loading__progress-track'
                        style={{ width: `${displayProgress}%` }}
                    />
                </div>
            </div>

            {/* Floating geometric elements */}
            <div className='geo-loading__floating-elements'>
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className={`geo-loading__floating-element geo-loading__floating-element--${i + 1}`}
                    >
                        {['◊', '⬟', '⬢', '▣', '◐', '⬪', '◰', '⬡'][i]}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Loading;