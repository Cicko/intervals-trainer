import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import PlayIcon from '@mui/icons-material/PlayArrow';
import SelectIcon from '@mui/icons-material/Rule';
import { Interval } from './types';

export interface ActionButtonsProps {
    readonly selectedIntervals: Interval[];
    readonly onPractice: () => void;
}

export function ActionButtons(props: ActionButtonsProps): React.ReactElement {
    const {
        selectedIntervals,
        onPractice,
    } = props;

    const NotPlayingBtns = (
        <Stack direction="row" spacing={2} justifyContent="center">
            {selectedIntervals.length ?
                <Button startIcon={<SelectIcon />} variant="outlined" onClick={onPractice}>
                    Listen intervals
                </Button> : null
            }
        </Stack>
    )

    return <Container style={{ marginTop: 20 }}>
        {NotPlayingBtns}
        </Container>
}
