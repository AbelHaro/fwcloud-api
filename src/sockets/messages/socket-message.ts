import moment from "moment";
import * as uuid from "uuid";

export class SocketMessageInterface {
    id: string;
    timestamp: number;
    channel: string;
    payload: object
}
export class SocketMessage implements SocketMessageInterface {
    id: string;
    timestamp: number;
    channel: string;
    payload: object
    
    constructor(payload: object, channel: string = null) {
        this.id = uuid.v1();
        this.timestamp = moment().valueOf();
        this.channel = channel;
        this.payload = payload;
    }
}