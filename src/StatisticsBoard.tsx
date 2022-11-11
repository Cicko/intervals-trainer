import Paper from '@mui/material/Paper';
import * as React from 'react';
import { Interval, IStatisticsCounter } from './types';
import { getMostCorrectIntervals, getMostWrongIntervals } from './utils';

export interface StatisticsBoardProps {
    readonly counter: IStatisticsCounter;
}

export function StatisticsBoard(props: StatisticsBoardProps): React.ReactElement {
    const { counter } = props;

    function renderStatisticsValues(): React.ReactNode {
        const mostCorrect: Interval[] = getMostCorrectIntervals(counter,3, 5)
        const mostWrong: Interval[] = getMostWrongIntervals(counter,3, 5);

        return (
            <div className="statistic-values">
                <div className="correct-counter">
                    Most correct: {mostCorrect.length ? mostCorrect.join(', ') : 'Play more to see statistics'}
                </div>
                <div className="wrong-counter">
                    Most wrong: {mostWrong.length ? mostWrong.join(', ') : 'Play more to see statistics'}
                </div>
            </div>
        )
    }

    return (
        <Paper
            elevation={1}
            style={{
                backgroundColor: '#EEEEEE',
                width: 400,
                height: 200,
            }}
        >
            {renderStatisticsValues()}
        </Paper>
    )
}
