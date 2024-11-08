export interface WebsocketMessage {
    op: number,
    d?: any,
    err?: string
}