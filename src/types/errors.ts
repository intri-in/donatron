export interface GenericErrorType {
    code?: string | undefined;
    message?: string | undefined;
    status: number;
    statusText: string;
}