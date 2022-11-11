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

function App() {
    const [machine, setMachine] = useState(new SynthMachine());

    // PRACTICE
    const [selectedIntervals, setSelectedIntervals] = useState<Interval[]>([]);
    const [first, setFirst] = useState('');
    const [second, setSecond] = useState('');

    // SHARED
    const [interval, setInterval] = useState<Interval | undefined>(undefined);

    const onPractice = () => {
        const values = machine.playRandomInterval(selectedIntervals);
        setFirst(values.first);
        setSecond(values.second);
        setInterval(values.interval as Interval);
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

    const PracticeValues: React.ReactNode = (
        <p className="read-the-docs">
            {interval && renderRandomValues()}
        </p>
    )

    return (
        <div className="App">
            {renderIntervalsTilesContainer()}
            <ActionButtons
                selectedIntervals={selectedIntervals}
                onPractice={onPractice}
            />
            {PracticeValues}
        </div>
    )
}

export default App;
