export default class Singleton {
  private static _instance = null

  public static get Instance() {
    return this.GetInstance()
  }

  protected static GetInstance<T>() {
    if (this._instance === null) {
      this._instance = new this() as T
    }
    return this._instance as T
  }
}
