declare var Reflect: {
  getOwnMetadata: (metadataName: string, target: any) => any;
  defineMetadata: (metadataName: string, value: any, target: any) => any;
}

export interface CleanableMetadata {
  id?: string;
}

export interface CleanMetadata {
  id?: string;
  before?: boolean;
}

export function Cleanable (options: CleanableMetadata = { id: '' }) {
  return function (target: any, key: string) {
    const metadataId: string = `__cleanable__subscriptions__${options.id}`;
    const baseMetadata = Reflect.getOwnMetadata(metadataId, target) || [];
    Reflect.defineMetadata(metadataId, [...baseMetadata, key], target);
  }
}


export function Clean (options: CleanMetadata = { id: '', before: true }) {

  options.id = options.id || '';
  if (typeof options.before !== 'boolean') {
    options.before = true;
  }

  return function (target: any, key: string, descriptor: any) {
    const method = descriptor.value;

    descriptor.value = function () {

      if (!options.before) {
        method.apply(this, arguments);
      }

      const metadata = Reflect.getOwnMetadata(`__cleanable__subscriptions__${options.id}`, target);
      if (metadata) {
        metadata.forEach((property: string) => {
          if (property && this[property]) {

            if (this[property].unsubscribe) {
              this[property].unsubscribe();
            }
            else if (Array.isArray(this[property])) {

              // Handle array of subscriptions
              (<any[]>this[property]).forEach((x) => {
                if (x.unsubscribe) {
                  x.unsubscribe();
                }
              });
            }

          }
        });
      }

      if (options.before) {
        return method.apply(this, arguments);
      }
    }

    return descriptor;
  }
}


