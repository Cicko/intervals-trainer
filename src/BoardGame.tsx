import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import * as React from 'react';
import { Intervals } from './SynthMachine';
import Paper from '@mui/material/Paper';
import { Accumulator, Interval } from './types';
import { tileStyle } from './commons';

export interface IBoardGame {
    readonly interval: Accumulator<Interval>;
    readonly onSelectAnswer: (arg0: Interval) => () => void;
    readonly selectedAnswer: Accumulator<Interval>;
    readonly selectedIntervals: Interval[];
    readonly score: number;
}

export function BoardGame(props: IBoardGame): React.ReactElement {
    const {
        interval,
        onSelectAnswer,
        selectedAnswer,
        selectedIntervals,
        score,
    } = props;

    function renderBoardGame(): React.ReactNode {
        const intervalsForGame = selectedIntervals.length > 1 ? Intervals
            .filter(val => selectedIntervals.includes(val)) : Intervals;

        return intervalsForGame.map(val => (
            <Grid item xs={6} sm={intervalsForGame.length % 2 === 0 ? 6 : 4} key={val}>
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

    return (
        <>
            <h1>You currently have {score} points</h1>
            <div className="container-checkboxes">
                <Box sx={{ width: '100%' }}>
                    <Grid
                        container
                        rowSpacing={2}
                        columnSpacing={{ xs: 2, sm: 2, md: 3 }}
                    >
                        {renderBoardGame()}
                    </Grid>
                </Box>
            </div>
        </>
    )
}
