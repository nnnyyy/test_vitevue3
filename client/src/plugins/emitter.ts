import {Emitter, EventType} from 'mitt'
import { getCurrentInstance } from "vue";

export function useEmitter() {
    const internalInstance = getCurrentInstance();
    const emitter: Emitter<Record<EventType, unknown>> = internalInstance!.appContext.config.globalProperties.emitter;

    return emitter;
}
