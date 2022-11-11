import { useState, useEffect } from 'react'
import { Favorite } from '@mui/icons-material';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import './App.css'
import { SynthMachine, Intervals } from './SynthMachine';
import * as React from 'react';
import {Accumulator, Interval, IStatisticsCounter} from './types';
import { InitialCounter, tileStyle } from './commons';
import { StatisticsBoard } from './StatisticsBoard';
import { getMostWrongIntervals } from './utils';
import { ActionButtons } from './ActionButtons';
import { BoardGame } from './BoardGame';

const MAX_ITERATIONS = 10;

function App() {
    const [machine, setMachine] = useState(new SynthMachine());
    let timer: number;

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

    // STATISTICS
    const localStorageCounter = window.localStorage.getItem('counter');
    const [counter, setCounter] = useState<IStatisticsCounter>(
        localStorageCounter ? JSON.parse(localStorageCounter) : InitialCounter
    );


    useEffect(() => {
        window.localStorage.setItem('counter', JSON.stringify(counter));
    }, [counter]);


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
            playRandomInterval();
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

    const onStartMostWrong = () => {
        setSelectedIntervals(getMostWrongIntervals(counter,3));
        setTimeout(() => {
            onStartGame();
        }, 1000);
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

    function increaseCorrectCounterFor(interval: Interval): void {
        if (interval) {
            setCounter({
                ...counter,
                [interval]: {
                    correct: counter[interval].correct + 1,
                    wrong: counter[interval].wrong,
                },
            });
        }
    }

    function increaseWrongCounterFor(interval: Interval): void {
        if (interval) {
            setCounter({
                ...counter,
                [interval]: {
                    wrong: counter[interval].wrong + 1,
                    correct: counter[interval].correct,
                },
            });
        }
    }

    const onSelectAnswer = (selected: Interval) => () => {
        setSelectedAnswer(selected)
        const isAnswerCorrect: boolean = interval === selected;
        if (isAnswerCorrect) {
            const extraPoints = selectedIntervals.length || Intervals.length;
            increaseCorrectCounterFor(interval!);
            setScore(score + extraPoints);
        } else {
            if (score - 5 < 0) {
                setTimeout(() => onQuitGame(), 1000);
            }
            increaseWrongCounterFor(interval!);
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
        </p>
    )


    const Footer: React.ReactNode = (
        <p className="read-the-docs">
            Created with <Favorite /> by Rudolf Cicko © 2022
        </p>
    )

    return (
        <div className="App">
            {/*<StatisticsBoard counter={counter}/>*/}
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
                selectedIntervals={selectedIntervals}
                onPractice={onPractice}
                onQuitGame={onQuitGame}
                onReplay={onReplay}
                onStartGame={onStartGame}
                onStartGameWrongIntervals={onStartMostWrong}
            />
            <Rating
                name="simple-controlled"
                value={(selectedIntervals.length / 12) * 5}
                style={{marginTop: 20}}
            />
            {PracticeValues}
            {Footer}
        </div>
    )
}

export default App;
