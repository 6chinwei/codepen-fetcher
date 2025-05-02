import { type CodePenApi } from './types';
import CodePenGraphqlApi from './codePenGraphqlApi';
import ApiRequestHeaders from './codePenApiRequestHeaders';
import QueryBuilder from './codePenGraphqlQueryBuilder';

let codePenApi: CodePenApi | undefined;
let initPromise: Promise<CodePenApi> | undefined;

export async function makeCodePenApiInstance(): Promise<CodePenApi> {
  if (codePenApi) {
    return codePenApi;
  }

  if (!initPromise) {
    initPromise = initializeCodePenGraphqlApi();
  }

  return initPromise;
}

async function initializeCodePenGraphqlApi(): Promise<CodePenApi> {
  const apiRequestHeaders = new ApiRequestHeaders();
  const queryBuilder = new QueryBuilder();

  codePenApi = await new CodePenGraphqlApi(apiRequestHeaders, queryBuilder).init();

  return codePenApi;
}
