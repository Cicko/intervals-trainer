import { useState, useEffect } from 'react'
import { Favorite } from '@mui/icons-material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import './App.css'
import { SynthMachine, Intervals } from './SynthMachine';
import * as React from 'react';

const MAX_ITERATIONS = 10;

function App() {
    const [machine, setMachine] = useState(new SynthMachine());
    let timer;

    // PRACTICE
    const [selectedIntervals, setSelectedIntervals] = useState([]);
    const [first, setFirst] = useState('');
    const [second, setSecond] = useState('');

    // SHARED
    const [interval, setInterval] = useState('');

    // GAME
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(Number(window.localStorage.getItem('score')) || 0);
    const [selectedAnswer, setSelectedAnswer] = useState(undefined);
    const [iteration, setIteration] = useState(0);
    // STATISTICS


    function playRandomInterval() {
        const values = machine.playRandomInterval(
        selectedIntervals.length > 1 ? selectedIntervals : Intervals
        );
        setFirst(values.first);
        setSecond(values.second);
        setInterval(values.interval);
    }

    function playRandomIntervalInOneSecond() {
        timer = setTimeout(() => {
            setSelectedAnswer(undefined);
            playRandomInterval();
        }, 1000);
    }

    const onPracticeBtn = () => {
        playRandomInterval();
    }

    const onStartGame = () => {
        setScore(0);
        setIsPlaying(true);
        setInterval('');
        setSelectedAnswer(undefined);
        playRandomIntervalInOneSecond();
    }

    const onReplay = () => {
        machine.replay();
    }

    const onQuitGame = () => {
        setScore(0);
        setIsPlaying(false);
        clearTimeout();
        setMachine(new SynthMachine());
        setIteration(1);
    }


    const tileStyle: React.CSSProperties = {
        display: 'flex',
        fontSize: 24,
        fontFamily: 'Roboto',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    }

    function renderIntervalsCheckboxes(): React.ReactNode {
        const onAddInterval = (interval) => () => {
            if (selectedIntervals.includes(interval)) {
                const intervals = selectedIntervals.filter(val => val != interval);
                setSelectedIntervals(intervals);
            } else {
                setSelectedIntervals((selected) => [...selected, interval])
            }
        }

        return Intervals.map(interval => (
            <Grid item xs={6} key={interval}>
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

    const renderBoardGame = () => {
        const onSelectAnswer = (selected) => () => {
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

        const intervalsForGame = selectedIntervals.length > 1 ? Intervals
            .filter(val => selectedIntervals.includes(val)) : Intervals;


        return intervalsForGame.map(val => (
            <Grid item xs={6} key={val}>
                <Paper
                    onClick={onSelectAnswer(val)}
                    elevation={1}
                    style={{
                        backgroundColor: selectedAnswer === val
                            ? (val === interval ? 'green' : 'red')
                            : (selectedAnswer && val === interval ? 'green' : 'white'),
                        color: 'black',
                        ...tileStyle,
                    }}
                >{val}</Paper>
            </Grid>
        ))
    }

    const renderRandomValues = () => <>{interval} from {first} to {second}</>

    const renderIntervalsTraining = () => (
        <>
            <h1>Intervals training</h1>
            <div className="container-checkboxes">
                <Box sx={{ width: '100%' }}>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        {renderIntervalsCheckboxes()}
                    </Grid>
                </Box>
            </div>
        </>
    )

    const renderPlayingBoard = () => (
        <>
            <h1>You currently have {score} points</h1>
            <div className="container-checkboxes">
                <Box sx={{ width: '100%' }}>
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                        {renderBoardGame()}
                    </Grid>
                </Box>
            </div>
        </>
    )

    const ActionButtons: React.ReactNode =
        !isPlaying ?
        (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
            <div className="card">
                <button onClick={onPracticeBtn}>
                    {selectedIntervals.length ? 'Practice' : 'Select intervals'}
                </button>
            </div>
            <div className="card">
                <button onClick={onStartGame}>
                    Start game
                </button>
            </div>
            </div>
        ) : (
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <div className="card">
                    <button onClick={onReplay}>
                        Replay
                    </button>
                </div>
                <div className="card">
                    <button onClick={onQuitGame}>
                        Quit game
                    </button>
                </div>
            </div>
        );

    const PracticeValues: React.ReactNode = (
        <p className="read-the-docs">
            {!isPlaying && interval && renderRandomValues()}
            {isPlaying && `${iteration} / ${MAX_ITERATIONS}`}
        </p>
    )


    const Footer: React.ReactNode = (
        <p className="read-the-docs">
            Created with <Favorite /> by Rudolf Cicko © 2022
        </p>
    )

    return (
        <div className="App">
            <p className="read-the-docs">
                Best score is {bestScore}
            </p>
            {isPlaying ? renderPlayingBoard() : renderIntervalsTraining()}
            {ActionButtons}
            {PracticeValues}
            {Footer}
        </div>
    )
}

export default App
