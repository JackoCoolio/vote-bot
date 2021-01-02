import { Client, Message } from 'discord.js';

export interface CommandState {
    client: Client;
    message: Message;
    parameters: Map<string, string | Array<string>>;
    [key: string]: any;
}

export type CommandCallbackFunction = (state: CommandState) => void;

/**
 * Parses Discord messages for commands.
 */
export class CommandManager {

    /**
     * A map of functions to be run for each command.
     */
    commands: Map<string, CommandCallbackFunction>;

    /**
     * The prefix that must precede every command.
     */
    prefix: string;

    /**
     * The state to pass to commands.
     */
    state: object;

    /**
     * Constructs a new CommandManager with an empty Map.
     * 
     * @param prefix the prefix that must precede every command
     */
    constructor(prefix: string) {
        this.prefix = prefix;
        this.commands = new Map<string, CommandCallbackFunction>();
    }

    /**
     * Sets the state object that is passed for every command.
     * 
     * @param state the state object
     */
    setState(state: object): void {
        this.state = state;
    }

    /**
     * Returns the current state object.
     * 
     * @returns an object
     */
    getState(): object {
        return this.state;
    }

    /**
     * Registers a command.
     * 
     * @param aliases all aliases the command can have
     * @param callback the function to be run when the command is run
     */
    registerCommand(aliases: string[] | string, callback: CommandCallbackFunction): void {
        for (const alias of (typeof aliases == 'string') ? [aliases] : aliases) {
            this.commands.set(alias, callback);
        }
    }

    /**
     * Parses a message as a command and runs it if a matching command exists.
     * 
     * @param message the Message to be parsed
     * @param client the discord.js Client
     * 
     * @returns true if the command exists, false otherwise
     */
    parse(message: Message, client: Client): boolean {

        /*
            For example, if the following command is called,

            !command flag key:value list:[element zero;element one;element two] otherkey:"value with whitespace"

            parse() will return this Map:

            Map {
                'flag' => true,
                'key' => 'value',
                'list' => [ 'element zero', 'element one', 'element two' ],
                'otherkey' => 'value with whitespace'
            }
        */

        if (!message.content.toLowerCase().startsWith(this.prefix.toLowerCase())) return;

        // don't need to worry about leading whitespace, because Discord removes automatically
        const command = message.content.split(' ')[0].substring(this.prefix.length);

        // check if command exists
        if (!this.commands.has(command)) return false;

        // parse parameter substring
        const paramSubstring = message.content.split(' ').slice(1).join(' ');

        const parameters = new Map<string, any>();

        var currentKey = '';
        var currentValue = '';
        var mode: 'key' | 'value' | 'stringValue' = 'key';
        for (let i = 0; i < paramSubstring.length; i++) {
            const char = paramSubstring[i];

            if (mode == 'key') {
                if (char == ':') {
                    // switch to value
                    mode = 'value';
                } else if (char == ' ') {
                    // add as flag, not key
                    // add to param map

                    parameters.set(currentKey, true);
                    currentKey = '';
                } else {
                    currentKey += char;
                }
            } else if (mode == 'value') {
                if (char == '"') {
                    // switch to string value
                    mode = 'stringValue';
                } else if (char == ' ') {

                    // allow for leading whitespace
                    if (currentValue == '')
                        continue;

                    // switch to key
                    // add to param map
                    mode = 'key';

                    parameters.set(currentKey, currentValue);
                    currentKey = '';
                    currentValue = '';
                } else if (char == '[') {
                    // parse as list
                    // add to param map

                    const parseResults = this.parseList(paramSubstring, i);

                    i += parseResults.skipIndices;

                    parameters.set(currentKey, parseResults.elements);
                    currentKey = '';
                    currentValue = '';
                } else {
                    currentValue += char;
                }
            } else if (mode == 'stringValue') {
                if (char == '"') {
                    // switch to key
                    // add to param map
                    mode = 'key';

                    parameters.set(currentKey, currentValue);
                    currentKey = '';
                    currentValue = '';
                } else {
                    currentValue += char;
                }
            }

        }

        if (mode == 'key') {
            // add as flag
            parameters.set(currentKey, true);
        } else if (mode == 'value' || mode == 'stringValue') {
            // add to param map
            parameters.set(currentKey, currentValue);
        }

        // call the command
        const cleanParameters = parameters;
        parameters.forEach((val, key) => {
            if (key == '')
                cleanParameters.delete(key);
        });

        let commandState: CommandState = {
            client: client,
            message: message,
            parameters: cleanParameters,
            ...this.state
        }

        this.commands.get(command)(commandState);

        return true;

    }

    private parseList(paramSubstring: string, start: number): { skipIndices: number, elements: Array<string> } {

        var temp: string = '';
        var elements: Array<string> = [];
        var i = start + 1;
        for (; i < paramSubstring.length; i++) {
            if (paramSubstring[i] == ']') {
                break;
            } else if (paramSubstring[i] == ';') {
                elements.push(temp.trim());
                temp = '';
            } else {
                temp += paramSubstring[i];
            }
        }

        // push last element
        elements.push(temp.trim());

        // filter empty strings
        elements = elements.filter(elt => elt.length > 0);

        return {
            skipIndices: i - start,
            elements: elements
        };

    }

}