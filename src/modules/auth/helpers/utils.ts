export function getInitialName(name: string): string {
    if (!name) return ''
    const words = name.trim().split(' ').filter(Boolean)
    if (words.length === 0) return ''
    if (words.length === 1) {
        const word = words[0]
        return word.slice(0, 2).toUpperCase()
    }
    const firstInitial = words[0][0]
    const lastInitial = words[words.length - 1][0]
    return (firstInitial + lastInitial).toUpperCase()
}