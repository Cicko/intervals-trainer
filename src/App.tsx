import { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import './App.css'
import { SynthMachine, Intervals } from './SynthMachine';
import * as React from 'react';
import { Accumulator, Interval } from './types';
import { tileStyle } from './commons';
import { ActionButtons } from './ActionButtons';
import { BoardGame } from './BoardGame';
import { PitchDetector } from "./PitchDetector";

const MAX_ITERATIONS = 10;

function App() {
    const [machine, setMachine] = useState(new SynthMachine());
    let timer: number;
    const [pitchDetector, setPitchDetector] = useState(new PitchDetector(pitchDetectionCb));
    const [isPitchDetecting, setIsPitchDetecting] = useState<boolean>(false);
    const [pitchNote, setPitchNote] = useState<string>('');

    useEffect(() => {
        setIsPitchDetecting(pitchDetector.isRunning);
    }, [pitchNote]);

    // PRACTICE
    const [selectedIntervals, setSelectedIntervals] = useState<Interval[]>([]);
    const [first, setFirst] = useState('');
    const [second, setSecond] = useState('');

    // SHARED
    const [interval, setInterval] = useState<Accumulator<Interval>>(undefined);

    // GAME
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(Number(window.localStorage.getItem('score')) || 0);
    const [selectedAnswer, setSelectedAnswer] = useState<Accumulator<Interval>>(undefined);
    const [iteration, setIteration] = useState(0);

    function pitchDetectionCb(note: string): void {
        setPitchNote(note);
    }

    function onPitchDetect(): void {
        if (pitchDetector.isRunning) {
            setIsPitchDetecting(false);
            setPitchNote('');
            pitchDetector.stopPitchDetection();
        } else {
            setIsPitchDetecting(true);
            pitchDetector.startPitchDetection();
        }
    }

    function playRandomInterval(practice: boolean) {
        const values = machine.playRandomInterval(
        selectedIntervals.length > (1 - (practice ? 1 : 0)) ? selectedIntervals : Intervals
        );
        setFirst(values.first);
        setSecond(values.second);
        setInterval(values.interval);
    }

    function playRandomIntervalInOneSecond() {
        timer = setTimeout(() => {
            setSelectedAnswer(undefined);
            playRandomInterval(false);
        }, 1000);
    }

    const onPractice = () => {
        playRandomInterval(true);
    }

    const onStartGame = () => {
        setScore(0);
        setIsPlaying(true);
        setSelectedAnswer(undefined);
        setInterval(undefined);
        playRandomIntervalInOneSecond();
    }

    const onReplay = () => {
        machine.replay();
    }

    const onQuitGame = () => {
        setScore(0);
        setIsPlaying(false);
        clearTimeout(timer);
        setMachine(new SynthMachine());
        setIteration(1);
    }

    function renderIntervalsTiles(): React.ReactNode {
        const onAddInterval = (interval: Interval) => () => {
            if (selectedIntervals.includes(interval)) {
                const intervals: Interval[] = selectedIntervals.filter(val => val != interval);
                setSelectedIntervals(intervals);
            } else {
                setSelectedIntervals((selected: Interval[]) => [...selected, interval])
            }
        }

        return Intervals.map(interval => (
            <Grid item xs={6} sm={4} key={interval}>
                <Paper
                    onClick={onAddInterval(interval)}
                    elevation={1}
                    style={{
                        backgroundColor: selectedIntervals.includes(interval) ? 'green' : 'white',
                        color: selectedIntervals.includes(interval) ? 'white' : 'black',
                        ...tileStyle,
                    }}
                >{interval}</Paper>
            </Grid>
        ))
    }

    const onSelectAnswer = (selected: Interval) => () => {
        setSelectedAnswer(selected)
        const isAnswerCorrect: boolean = interval === selected;
        if (isAnswerCorrect) {
            const extraPoints = selectedIntervals.length || Intervals.length;
            setScore(score + extraPoints);
        } else {
            if (score - 5 < 0) {
                setTimeout(() => onQuitGame(), 1000);
            }
            setScore(score - 2 < 0 ? 0 : score - 2);
        }
        if (iteration === MAX_ITERATIONS) {
            if (score > bestScore) {
                setBestScore(score);
                window.localStorage.setItem('score', String(score));
            }
            setTimeout(() => onQuitGame(), 1000);
        } else {
            setIteration(iteration + 1);
            playRandomIntervalInOneSecond();
        }
    }

    const renderRandomValues = () => <>{interval} from {first} to {second}</>

    const renderIntervalsTilesContainer = () => (
        <>
            <h1>Intervals training</h1>
            <div className="container-checkboxes">
                <Box sx={{ width: '100%' }}>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        {renderIntervalsTiles()}
                    </Grid>
                </Box>
            </div>
        </>
    )


    const ScoreResult = (
        <p className="read-the-docs">
            Best score is {bestScore}
        </p>
    )

    const PracticeValues: React.ReactNode = (
        <p className="read-the-docs">
            {!isPlaying && interval && renderRandomValues()}
            {isPlaying && `${iteration} / ${MAX_ITERATIONS}`}
            {pitchNote}
        </p>
    )

    return (
        <div className="App">
            {ScoreResult}
            {isPlaying
                ?
                <BoardGame
                    interval={interval}
                    onSelectAnswer={onSelectAnswer}
                    selectedAnswer={selectedAnswer}
                    selectedIntervals={selectedIntervals}
                    score={score}
                />
                : renderIntervalsTilesContainer()
            }
            <ActionButtons
                isPlaying={isPlaying}
                isPitchDetecting={isPitchDetecting}
                selectedIntervals={selectedIntervals}
                onPractice={onPractice}
                onQuitGame={onQuitGame}
                onReplay={onReplay}
                onStartGame={onStartGame}
                onPitchDetect={onPitchDetect}
            />
            {PracticeValues}
        </div>
    )
}

export default App;
