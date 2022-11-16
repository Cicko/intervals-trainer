import { autoCorrelate, getNoteFromPitch } from "./utils";

export type PitchDetectCb = (note: string) => void;

export interface PitchDetectorConfiguration {
    readonly fps: number;
    readonly buflen: number;
}

const DefaultPitchDetectorConfiguration: PitchDetectorConfiguration = {
    fps: 60,
    buflen: 2048,
}

export class PitchDetector {
    private readonly _callback: PitchDetectCb;
    private readonly _config: PitchDetectorConfiguration;

    private _analyser: AnalyserNode | undefined;
    private _ctx: AudioContext;
    private _buffer: Float32Array;
    public isRunning: boolean = false;

    constructor(callback: PitchDetectCb,
                config: PitchDetectorConfiguration = DefaultPitchDetectorConfiguration) {
        this._ctx = new AudioContext();
        this._callback = callback;
        this._config = config;
        this._buffer = new Float32Array(config.buflen);
    }

    public get context(): AudioContext {
        return this._ctx;
    }

    public get buffer(): Float32Array {
        return this._buffer;
    }

    public startPitchDetection(): void {
        console.log('Start pitch detection');
        this._ctx = new AudioContext();
        this._analyser = this._ctx.createAnalyser();

        navigator.mediaDevices.getUserMedia({
            audio: true,
        }).then(stream => {
            const mediaStreamSource = this._ctx.createMediaStreamSource(stream);
            this._analyser!.fftSize = 2048;
            mediaStreamSource.connect(this._analyser!);
            this.isRunning = true;
            this.pitchDetection();
        });
    }

    public stopPitchDetection(): void {
        this.isRunning = false;
    }

    public pitchDetection(): void {
        this._analyser!.getFloatTimeDomainData(this.buffer);

        const freq = autoCorrelate(this.buffer, this._ctx.sampleRate);

        if (freq !== -1) {
            const note = getNoteFromPitch(freq);
            this._callback(note);
        }

        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = window.webkitRequestAnimationFrame;

        if (this.isRunning) {
            window.requestAnimationFrame(() => {
                setTimeout(() => {
                    this.pitchDetection()
                }, 1000/this._config.fps);
            });
        }
    }
}
