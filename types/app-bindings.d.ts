export interface BaseAppBindings {
  Bindings: CloudflareBindings
}

export interface AppBindings<R> extends BaseAppBindings {
  Variables: R
}
