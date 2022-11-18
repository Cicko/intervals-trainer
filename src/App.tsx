import { useEffect, useState} from 'react'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import './App.css'
import { SynthMachine, Intervals } from './SynthMachine';
import * as React from 'react';
import {Accumulator, GameMode, GameModeType, Interval} from './types';
import { tileStyle } from './commons';
import { ActionButtons } from './ActionButtons';
import { BoardGame } from './BoardGame';
import { PitchDetector } from "./PitchDetector";
import {getIntervalFromTwoNotes} from "./utils";

const MAX_ITERATIONS = 10;


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
    const [machine, setMachine] = useState(new SynthMachine());
    let timer: number;

    // PITCH DETECTION
    const [pitchDetector, setPitchDetector] = useState(new PitchDetector(pitchDetectionCb));
    const [isPitchDetecting, setIsPitchDetecting] = useState<boolean>(false);
    const [pitchNote, setPitchNote] = useState<string>('');

    // PRACTICE
    const [selectedIntervals, setSelectedIntervals] = useState<Interval[]>([]);
    const [first, setFirst] = useState('');
    const [second, setSecond] = useState('pepe');

    // SHARED
    const [interval, setInterval] = useState<Accumulator<Interval>>(undefined);

    // GAME
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(Number(window.localStorage.getItem('score')) || 0);
    const [selectedAnswer, setSelectedAnswer] = useState<Accumulator<Interval>>(undefined);
    const [iteration, setIteration] = useState(0);
    const [gameMode, setGameMode] = useState<Accumulator<GameModeType>>(undefined);



    const [snackOpen, setSnackOpen] = React.useState(false);
    const handleSnackOpen = () => {
        setSnackOpen(true);
    };


    useEffect(() => {
        if (isPlaying) {
            const sangInterval = getIntervalFromTwoNotes(first.slice(0, -1), pitchNote)
            setSelectedAnswer(sangInterval);
            /*
            if (sangInterval === interval) {
                setTimeout(() => {
                    pitchDetector.startPitchDetection();
                }, 1000);
            }

             */
        }
    }, [pitchNote]);

    function pitchDetectionCb(note: string) {
        setPitchNote(note);
    }

    function startOrStopPitchDetector(): void {
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
        setGameMode(GameMode.INTERVAL_GUESSING);
        setScore(0);
        setIsPlaying(true);
        setSelectedAnswer(undefined);
        setInterval(undefined);
        playRandomIntervalInOneSecond();
    }

    const onStartPitchGame = () => {
        setGameMode(GameMode.PITCH_DETECTION);
        setScore(0);
        setIsPlaying(true);
        setSelectedAnswer(undefined);
        setInterval(undefined);
        startPitchGame();
    }

    function startPitchGame(): void {
        const result = machine.playOneRandomNoteAndReturnIntervalResults(
            selectedIntervals.length > 1 ? selectedIntervals : Intervals
        );
        setFirst(result.first);
        setInterval(result.interval);
        setSecond(result.second);
        setTimeout(() => {
            startOrStopPitchDetector();
            setSnackOpen(true);
        }, 1000);
    }

    const onReplay = () => {
        if (gameMode === GameMode.PITCH_DETECTION) {
            machine.replayOneNote();
        } else {
            machine.replay();
        }
    }

    const onQuitGame = () => {
        setScore(0);
        setIsPlaying(false);
        clearTimeout(timer);
        setMachine(new SynthMachine());
        setIteration(1);
        if (gameMode === GameMode.PITCH_DETECTION) {
            startOrStopPitchDetector();
        }
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
                    selectedAnswer={selectedAnswer || String(pitchNote)}
                    gameMode={gameMode!}
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
                onStartPitchGame={onStartPitchGame}
            />
            {PracticeValues}
            {gameMode === GameMode.PITCH_DETECTION && isPlaying && (
                <div>
                    <h1>Sing interval {interval}</h1>
                    <h2>Singing {pitchNote}</h2>
                </div>
            )}
            <Snackbar open={snackOpen} autoHideDuration={2000}>
                <Alert onClose={handleSnackOpen} severity="info" sx={{ width: '100%' }}>
                    You can start singing
                </Alert>
            </Snackbar>
        </div>
    )
}

export default App;
