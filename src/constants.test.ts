import { makeDefaultCommands } from "./constants";
import { DefaultCommand } from "./config";

describe('makeDefaultCommands', () => {
    it('should add the `id` field to the returned commands', () => {
        const commandFieldsById = {
            testCommand: {
                type: 'global',
                name: 'Does something',
                description: 'It does something awesome',
            }
        } satisfies Record<string, Omit<DefaultCommand, 'id'>>

        const defaultCommands = makeDefaultCommands(commandFieldsById)

        expect(defaultCommands.testCommand).toStrictEqual({
            id: 'testCommand',
            ...commandFieldsById.testCommand
        })
    })
})