export class AsyncQueue<T> {
    private data: T[];
    private front_index: number;
    private ondata_callbacks: ((value: T | PromiseLike<T>) => void)[];

    constructor() {
        this.data = [];
        this.ondata_callbacks = [];
        this.front_index = 0;
    }

    front(): Promise<T> {
        return new Promise((accept) => {
            if (this.isNotEmpty()) { accept(this.data[this.front_index]); }
            else { this.ondata_callbacks.push(accept); }
        });
    }

    length() {
        return this.data.length;
    }

    isNotEmpty() {
        return this.data.length > this.front_index;
    }

    popFront() {
        if (!this.isNotEmpty()) {
            throw new Error('Queue is empty');
        }

        this.front_index += 1;
        if (this.front_index > 100 && this.front_index >= this.data.length / 2) {
            this.reorganizeData();
        }
    }

    reorganizeData() {
        this.data = this.data.filter((_, index) => index <= this.front_index);
    }

    push(val: T) {
        this.data.push(val);
        this.ondata_callbacks.forEach(f => f(val));
        this.ondata_callbacks.length = 0;
    }

    splice(start: number, delete_count: number) {
        this.data.splice(start, delete_count);
    }
}
