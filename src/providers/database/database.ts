
import Dexie, { Table } from 'dexie';

export interface Friend {
    id?: number;
    name: string;
    age: number;
}
