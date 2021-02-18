interface ISet {
    background : string
    highlight : string
}

// interface IDashboard {
//     base : string
//     rightpanel : string
//     leftpanel : string
//     leftglass : string
//     data : {
//         circleSm : string
//         circleLg : string
//         textXs  : string
//         textSm : string
//         textLg : string
//     } & {hover : string}
// }

export interface ITheme {
    main: ISet & { link : string }
    // dashboard: IDashboard
}

export const darkTheme: ITheme = {
    main: {
        background: "#1E0F3C",
        highlight : "#81FFE8",
        link: "#fff"
    }
}

