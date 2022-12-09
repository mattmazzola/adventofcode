import fs from 'fs/promises'

async function main() {
    const inputText = await fs.readFile('./input.txt', 'utf-8')
    
    const elvesCalories: number[][] = [
        []
    ]

    const lines = inputText.split('\n')
    for (const line of lines) {
        const trimmedLine = line.trim()
        if (trimmedLine.length == 0) {
            elvesCalories.push([])
            continue
        }

        const lineNumber = Number(trimmedLine)
        if (!Number.isSafeInteger(lineNumber)) {
            continue
        }

        const elveCalories = elvesCalories.at(-1)!
        elveCalories.push(lineNumber)
    }

    const elfWithMostCalories = elvesCalories.reduce((max, elve) => {
        const elveMax = elve.reduce((sum, calories) => sum += calories, 0)

        return Math.max(max, elveMax)
    }, 0)

    console.log(elfWithMostCalories)
}

main()