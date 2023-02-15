export function AutoBind(_: any, _2: string | Symbol, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value
        return {
            configurable: true,
            get() {
                return originalMethod.bind(this);
            },
        }
    }
