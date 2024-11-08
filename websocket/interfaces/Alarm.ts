export interface AlarmPast {
    alertData: string,
    category: number,
    category_desc: "Missiles" | "Hostile aircraft intrusion",
    data: string,
    date: string,
    matrix_id: number,
    rid: number,
    time: string
}

export interface AlarmCurrent {
    id: string,
    cat: string,
    title: string,
    data: string[],
    desc: string,
}

export interface AlarmCategory {
    id: number,
    category: string,
    matrix_id: number,
    priority: number,
    queue: boolean
}

export interface WebsocketAlarm extends AlarmCurrent {
    time: number
}