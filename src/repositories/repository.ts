export default interface IRepository<T> {
  getOne: (id: string) => Promise<T | null>;
  getAll: () => Promise<T[]>;
  save: (object: T, [...args]?: any) => Promise<T>;
}
