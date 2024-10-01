export const isError = (err: unknown): err is Error => {
    return err instanceof Error;
};