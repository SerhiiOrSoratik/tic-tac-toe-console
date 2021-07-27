import {checkConditionGame} from "./server.js";

describe('end game', () => {
    it('return false', () => {
        let field = [
            ['x', 'o', 'x'],
            ['x', 'o', 'x'],
            ['o', 'x', 'o']
        ];
        expect(checkConditionGame(field, 'x')).toBe(false)
    })

    it('return false', () => {
        let field = [
            ['x', 'x', 'x'],
            [' ', 'o', ' '],
            ['o', ' ', ' ']
        ];
        expect(checkConditionGame(field, 'x')).toBe(false)
    })

    it('return true and game continue', () => {
        let field = [
            ['x', 'o', 'x'],
            [' ', ' ', ' '],
            [' ', ' ', ' ']
        ];
        expect(checkConditionGame(field, 'x')).toBe(true)
    })
})


