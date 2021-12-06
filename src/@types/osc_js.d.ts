
declare module 'osc-js' {

        class BridgePlugin {
            constructor(...args: any[]);

            close(): void;

            open(...args: any[]): void;

            registerNotify(fn: any): void;

            send(binary: any, ...args: any[]): void;

            status(): any;

        }

        class Bundle {
            constructor(...args: any[]);

            add(item: any): void;

            pack(): any;

            timestamp(ms: any): void;

            unpack(dataView: any, ...args: any[]): any;

        }

        class DatagramPlugin {
            constructor(...args: any[]);

            close(): void;

            open(...args: any[]): void;

            registerNotify(fn: any): void;

            send(binary: any, ...args: any[]): void;

            status(): any;

        }

        class Message extends TypedMessage{
            constructor(...args: any[]);

            add(item: any): void;

        }

        class Packet {
            constructor(value: any);

            pack(): any;

            unpack(dataView: any, ...args: any[]): any;

        }

        class TypedMessage {
            constructor(address: any, args: any);

            add(type: any, item: any): void;

            pack(): any;

            unpack(dataView: any, ...args: any[]): any;

        }

        class WebsocketClientPlugin {
            constructor(customOptions: any);

            close(): void;

            open(...args: any[]): void;

            registerNotify(fn: any): void;

            send(binary: any): void;

            status(): any;

        }

        class WebsocketServerPlugin {
            constructor(customOptions: any);

            close(): void;

            open(...args: any[]): void;

            registerNotify(fn: any): void;

            send(binary: any): void;

            status(): any;

        }

}