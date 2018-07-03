
export class Guid {
    private static setOfGuids: Array<string> = new Array<string>();

    private static genGuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    static newGuid(): string {
        let guid: string = Guid.genGuid();
        while (Guid.setOfGuids.indexOf(guid) >= 0) {
            guid = Guid.genGuid();
        }
        return guid;
    }
}