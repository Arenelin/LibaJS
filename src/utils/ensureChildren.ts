import {ParentInstance} from "../types";
import {CacheManager} from "../children-cache-manager.ts";

export function ensureChildren(parentInstance: ParentInstance) {
    if (parentInstance && parentInstance.childrenComponents === undefined) {
        parentInstance.childrenComponents = new CacheManager()
    }
}
