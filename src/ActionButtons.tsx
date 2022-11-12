import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import PlayIcon from '@mui/icons-material/PlayArrow';
import SelectIcon from '@mui/icons-material/Rule';
import ReplayIcon from '@mui/icons-material/Replay';
import CancelIcon from '@mui/icons-material/Cancel';
import { Interval } from './types';

export interface ActionButtonsProps {
    readonly isPlaying: boolean;
    readonly selectedIntervals: Interval[];
    readonly onPractice: () => void;
    readonly onStartGame: () => void;
    readonly onReplay: () => void;
    readonly onQuitGame: () => void;
}

export function ActionButtons(props: ActionButtonsProps): React.ReactElement {
    const {
        isPlaying,
        selectedIntervals,
        onPractice,
        onReplay,
        onStartGame,
        onQuitGame,
    } = props;

    const PlayingBtns = (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <div className="card">
                <Button startIcon={<ReplayIcon />} onClick={onReplay} variant="contained">
                    Replay
                </Button>
            </div>
            <div className="card">
                <Button startIcon={<CancelIcon />} onClick={onQuitGame} variant="contained" style={{ backgroundColor: 'red'}}>
                    Quit game
                </Button>
            </div>
        </div>
    )

    const NotPlayingBtns = (
        <Stack direction="row" spacing={2} justifyContent="center">
            {selectedIntervals.length ?
                <Button startIcon={<SelectIcon />} variant="outlined" onClick={onPractice}>
                    Listen intervals
                </Button> : null
            }
            <Button startIcon={<PlayIcon />}  variant="contained" onClick={onStartGame}>
                Start game (with {selectedIntervals.length > 1 ?  selectedIntervals.length : 12} intervals)
            </Button>
        </Stack>
    )

    return <Container style={{ marginTop: 20 }}>
        {isPlaying ? PlayingBtns : NotPlayingBtns}
        </Container>
}
