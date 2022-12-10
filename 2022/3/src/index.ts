import fs from 'fs/promises'

const symbols = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const symbolPriorityMap = Object.fromEntries(symbols.split('').map((symbol, index) => [symbol, index + 1]))

function groupItems<T>(items: T[], groupSize: number): T[][] {
    const groups: T[][] = [
        []
    ]

    for (const item of items) {
        let currentGroup = groups.at(-1)!
        // If current group has reached max size, then start a new group
        if (currentGroup.length >= groupSize) {
            groups.push([])
            currentGroup = groups.at(-1)!
        }

        currentGroup.push(item)
    }

    return groups
}

function commonCharacters(strings: string[]): string[] {
    const firstCharactersSet = strings.at(0)!.split('')

    return strings.reduce((acc, str) => {
        const strSet = new Set(str);
        return acc.filter((ch) => strSet.has(ch));
    }, firstCharactersSet);
}

function sum(xs: number[]): number {
    return xs.reduce((sum, x) => sum + x, 0)
}

async function main() {
    const inputText = await fs.readFile('./input.txt', 'utf-8')
    const lines = inputText.split('\r\n')

    // Part 1
    const rucksackCompartments = lines.map(line => {
        const midIndex = line.length / 2
        const firstCompartment = line.slice(0, midIndex)
        const secondCompartment = line.slice(midIndex)

        return { firstCompartment, secondCompartment }
    })

    const sharedItemsPerSack = rucksackCompartments.map((o, rucksackIndex) => {
        const firstItems = o.firstCompartment.split('')
        const secondItems = o.secondCompartment.split('')
        const sharedItems = firstItems.filter(item => {
            return secondItems.includes(item)
        })

        if (sharedItems.length === 0) {
            console.warn(`Rucksack ${rucksackIndex} [${o.firstCompartment},${o.secondCompartment}] does not contain any shared items`)

            return { ...o, rucksackIndex, sharedItem: null, itemPriority: 0 }
        }
        // if (sharedItems.length > 1) {
        //     throw new Error(`Rucksack ${rucksackIndex} [${o.firstCompartment},${o.secondCompartment}] contains more than one shared items`)
        // }

        const sharedItem = sharedItems.at(0)!
        const itemPriority = symbolPriorityMap[sharedItem]

        return { ...o, rucksackIndex, sharedItem, itemPriority }
    })

    const prioritySum = sum(sharedItemsPerSack.map(x => x.itemPriority))
    console.log(`Part 1: `, prioritySum)

    // Part 2
    const groupMaxSize = 3
    const elveGroups = groupItems(lines, groupMaxSize)

    const elveGroupsPriorities = elveGroups.map(group => {
        const commonChars = commonCharacters(group)
        const commonChar = commonChars.at(0)!
        const priority = symbolPriorityMap[commonChar]

        return priority
    })

    const totalPriorityPerGroup = sum(elveGroupsPriorities)
    console.log(`Part 2: `, totalPriorityPerGroup)
}

main()