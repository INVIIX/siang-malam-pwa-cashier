// src/hooks/useNotificationSound.ts
import { useEffect, useRef, useState } from 'react';
import notificationSound from '../assets/audio/notification.mp3';

export const useNotificationSound = () => {
    const [ready, setReady] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const contextRef = useRef<AudioContext | null>(null);

    // Fallback: bunyi beep via Web Audio API
    const playBeep = () => {
        if (!contextRef.current) {
            contextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        const ctx = contextRef.current;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = 'sine'; // Bisa diganti: 'square', 'sawtooth', 'triangle'
        oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5 = 880 Hz
        gainNode.gain.setValueAtTime(0.05, ctx.currentTime); // Volume kecil

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.2); // Bunyi 0.2 detik
    };

    useEffect(() => {
        audioRef.current = new Audio(notificationSound);

        const unlockAudio = () => {
            if (!audioRef.current) return;

            audioRef.current
                .play()
                .then(() => {
                    audioRef.current!.pause();
                    audioRef.current!.currentTime = 0;
                    setReady(true);
                    console.log('🔊 Audio siap digunakan');

                    window.removeEventListener('click', unlockAudio);
                    window.removeEventListener('touchstart', unlockAudio);
                })
                .catch((err) => {
                    console.warn('⚠️ Gagal preload audio:', err);
                    // Tetap ready karena fallback Web Audio akan digunakan
                    setReady(true);
                });
        };

        window.addEventListener('click', unlockAudio);
        window.addEventListener('touchstart', unlockAudio);

        return () => {
            window.removeEventListener('click', unlockAudio);
            window.removeEventListener('touchstart', unlockAudio);
        };
    }, []);

    const play = () => {
        if (!ready) return;

        if (audioRef.current) {
            audioRef.current
                .play()
                .then(() => {
                    console.log('✅ Suara notifikasi berhasil diputar');
                })
                .catch((err) => {
                    console.warn('⚠️ Gagal play audio file, fallback ke beep:', err);
                    playBeep();
                });
        } else {
            playBeep(); // Fallback langsung jika audioRef tidak ada
        }
    };

    return { play, ready };
};
