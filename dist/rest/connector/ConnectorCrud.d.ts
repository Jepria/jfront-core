import { ConnectorBase } from './ConnectorBase';
import { SearchRequest, NetworkError } from '../types';
import { AxiosResponse, AxiosError } from 'axios';
export declare const handleAxiosError: (error: AxiosError) => NetworkError;
export declare const buildError: (response: AxiosResponse) => NetworkError;
export declare class ConnectorCrud<Dto, CreateDto, UpdateDto, SearchTemplate> extends ConnectorBase {
    private axios;
    create: (createDto: CreateDto, getRecordById?: boolean) => Promise<Dto | string>;
    update: (id: string, updateDto: UpdateDto, getRecordById?: boolean) => Promise<Dto | void>;
    delete: (id: string) => Promise<void>;
    postSearchRequest: (searchRequest: SearchRequest<SearchTemplate>) => Promise<string>;
    search: (searchId: string, pageSize: number, page: number) => Promise<Array<Dto>>;
    getResultSetSize: (searchId: string) => Promise<number>;
    getRecordById: (id: string) => Promise<Dto>;
}
