export default class StoreSerializer {
    opts: StoreSerializerOptions;

    constructor(opts: StoreSerializerOptions) {
        this.opts = opts;
    }

    serialize(data: V1SerializerData, version?: number): Buffer {
        const ver = version || this.opts.defaultVersion || 1;
        if (ver === 1) {
            return this.serializev1(data);
        } else {
            return Buffer.of(0x00);
        }
    }

    serializev1({ userid, username, data }: V1SerializerData): Buffer {
        const ver = Buffer.allocUnsafe(1);
        ver.writeInt8(1);
        const uid = Buffer.allocUnsafe(4);
        uid.writeInt32BE(userid);
        const uname = Buffer.from(username, "utf-8");
        let dat: Buffer;
        if (typeof data === "string") {
            dat = Buffer.from(data, "utf-8");
        } else {
            dat = data;
        }
        return Buffer.of(...ver, ...uid, ...uname, ...dat);
    }
}

// TODO: deflate store where possible
// i feel like store files could become quite big and inefficient without deflation so i want to eventually add automatic deflation to v1 or make a new version identical to v1 but only uses deflation.
// making two different version would make deflation detection easier and more efficient since it would never be deflated with v1 but always with v2 since the version byte is never deflated.

export interface V1SerializerData {
    userid: number;
    username: string;
    data: Buffer | string;
}

export interface StoreSerializerOptions {
    defaultVersion?: number;
}
