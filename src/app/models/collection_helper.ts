export class CollectionHelper<T> {

    private _data: Array<T>;

    constructor(data: Array<T>) {
        this._data = data;
    }

    get data(): Array<T> {
        return this._data;
    }

    get first(): T {
        return this.data.length > 0 ? this.data[0] : null;
    }

    get last(): T {
        return this.data.length > 0 ? this.data[this.data.length - 1] : null;
    }

    public getIndex<T2>(elt: T2, comparator: (elt1: T, elt2: T2) => boolean): number {
        let i = 0;
        for (; (i < this.data.length) && !comparator(this.data[i], elt); ++i);
        return i;
    }

    public get(n: number): T {
        let elt: T;
        if (this.data.length > 0) {
            if (n < 0) {
                elt = this.first;
            } else if (n >= this.data.length) {
                elt = this.last;
            } else {
                elt = this.data[n];
            }
        }
        return elt;
    }
}