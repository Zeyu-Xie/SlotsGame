

function temp(): number {
    console.log("123");

    return 1;
}
temp()


const rowNum = 5;
const reelNum = 6;
const symbols = [1, 2, 3]


const reel1 = [1, 2, 3, 1, 2, 3, 1]
const reel2 = [1, 2, 3, 1, 2, 3, 1]
const reel3 = [1, 2, 3, 1, 2, 3, 1]
const reel4 = [1, 2, 3, 1, 2, 3, 1]
const reel5 = [1, 2, 3, 1, 2, 3, 1]
const reel6 = [1, 2, 3, 1, 2, 3, 1]

const reelSets = [reel1, reel2, reel3, reel4, reel5, reel6];

/** class of spin result
 * reelStops: spin results
 * wins: if more than one win conbination occurs at one time, it contains all win conbinations
 */
// class SpinRes {
//     reelStops: num[]
//     wins: win[]
// }

// /** class of position
//  * x and y are coordinates
//  */
// class position {
//     x: number;
//     y: number;
//     constructor(x: number, y: number) {
//         this.x = x;
//         this.y = y;
//     }
// }

// /** class of win
//  * symID: id of win symbols
//  * positions: coordinates of win symbols
//  * amount: amount of win
//  */
// class Win {
//     symId: number;
//     postions: position[];
//     amount: number;
// }


// get the all symbols and reels of reel set
function GetReelSet(): number[][] {
    return reelSets;
}

// get the number of rows of play area
function GetRowNum(): number {
    return rowNum;
}

// get spin result
const stopIndex = [5,1,1,1,1,1]
function GetSpinResult(): number[][] {
    const reelStops: number[][] = [];

    for (let i = 0; i < reelNum; i++) {
        const reel = reelSets[i];
        const reelLength = reel.length;
        const start = stopIndex[i];
        const symbols : number[] = [];

        for (let j = 1; j < rowNum+1; j++) {
            const index = (start + j)%reelLength;
            symbols.push(reel[index]);
        }
        reelStops.push(symbols);
    }

    

    return reelStops;
}


// ---- test -----
const spin = GetSpinResult();
console.log("reelStops:", spin);