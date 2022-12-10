import fs from 'fs/promises'

enum Shapes {
    Rock = 'Rock',
    Paper = 'Paper',
    Scissors = 'Scissors',
}

const column1SymbolShapeMap: Record<string, Shapes> = {
    A: Shapes.Rock,
    B: Shapes.Paper,
    C: Shapes.Scissors,
}

const column2SymbolShapeMap: Record<string, Shapes> = {
    X: Shapes.Rock,
    Y: Shapes.Paper,
    Z: Shapes.Scissors,
}

enum Outcomes {
    Lose,
    Tie,
    Win,
}

const column2SymbolOutcomeMap: Record<string, Outcomes> = {
    X: Outcomes.Lose,
    Y: Outcomes.Tie,
    Z: Outcomes.Win,
}

const shapeScoreMap: Record<Shapes, number> = {
    [Shapes.Rock]: 1,
    [Shapes.Paper]: 2,
    [Shapes.Scissors]: 3,
}

const outcomeScoreMap: Record<Outcomes, number> = {
    [Outcomes.Lose]: 0,
    [Outcomes.Tie]: 3,
    [Outcomes.Win]: 6,
}

function rockPaperScissors(shape1: Shapes, shape2: Shapes): Outcomes {
    if (shape1 === shape2) {
        return Outcomes.Tie
    }

    if (shape2 === Shapes.Rock) {
        if (shape1 === Shapes.Paper) {
            return Outcomes.Lose
        }
        else if (shape1 === Shapes.Scissors) {
            return Outcomes.Win
        }
    }
    else if (shape2 === Shapes.Paper) {
        if (shape1 === Shapes.Rock) {
            return Outcomes.Win
        }
        else if (shape1 === Shapes.Scissors) {
            return Outcomes.Lose
        }
    }
    else if (shape2 === Shapes.Scissors) {
        if (shape1 === Shapes.Rock) {
            return Outcomes.Lose
        }
        else if (shape1 === Shapes.Paper) {
            return Outcomes.Win
        }
    }

    throw new Error(`Should not reach here`)
}

function getShapeToProduceOutcome(shape1: Shapes, outcome: Outcomes): Shapes {
    if (outcome === Outcomes.Tie) {
        return shape1
    }

    if (shape1 === Shapes.Rock) {
        if (outcome === Outcomes.Win) {
            return Shapes.Paper
        }
        else if (outcome === Outcomes.Lose) {
            return Shapes.Scissors
        }
    }
    else if (shape1 === Shapes.Paper) {
        if (outcome === Outcomes.Win) {
            return Shapes.Scissors
        }
        else if (outcome === Outcomes.Lose) {
            return Shapes.Rock
        }
    }
    else if (shape1 === Shapes.Scissors) {
        if (outcome === Outcomes.Win) {
            return Shapes.Rock
        }
        else if (outcome === Outcomes.Lose) {
            return Shapes.Paper
        }
    }

    throw new Error(`Should not reach here`)
}

async function main() {
    const inputText = await fs.readFile('./input.txt', 'utf-8')
    const linePairs = inputText.split('\r\n')
        .map(line => line.split(' '))

    const part1RoundTotals = linePairs.map(([col1Val, col2Val]) => {
        const opponentShape = column1SymbolShapeMap[col1Val]
        const myShape = column2SymbolShapeMap[col2Val]
        const shapeScore = shapeScoreMap[myShape]

        const outcome = rockPaperScissors(opponentShape, myShape)
        const outcomeScore = outcomeScoreMap[outcome]

        const score = shapeScore + outcomeScore

        return {
            col1Val,
            col2Val,
            score,
        }
    })

    const part1Total = part1RoundTotals.reduce((sum, round) => sum + round.score, 0)
    console.log(`Part 1 Total: `, part1Total)

    const part2RoundTotals = linePairs.map(([col1Val, col2Val]) => {
        const opponentShape = column1SymbolShapeMap[col1Val]
        const outcome = column2SymbolOutcomeMap[col2Val]
        const myShape = getShapeToProduceOutcome(opponentShape, outcome)
        const shapeScore = shapeScoreMap[myShape]
        const outcomeScore = outcomeScoreMap[outcome]

        const score = shapeScore + outcomeScore

        return {
            col1Val,
            col2Val,
            score,
        }
    })
    
    const part2Total = part2RoundTotals.reduce((sum, round) => sum + round.score, 0)
    console.log(`Part 2 Total: `, part2Total)
}

main()