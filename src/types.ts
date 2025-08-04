export interface CodePenApi {
  getPenById(penId: string): Promise<Pen|null>;
  getProfileByUsername(username: string): Promise<UserProfile|null>;
  getPensByUserId(userId: string, options?: FetchPensOptions): Promise<Pen[]>;
}

export type Pen = {
  access: string;
  config: {
    /** The content in the CSS Editor */
    css: string;
    /** The CSS preprocessor used */
    cssPreProcessor: string;
    /** Stuff for `<head>` */
    head: string;
    /** The content in the HTML Editor */
    html: string;
    /** The content in the JavaScript Editor */
    js: string;
    /** The JavaScript preprocessor used */
    jsPreProcessor: string;
    /** The URL list of external scripts */
    scripts: string[];
    /** The URL list of external stylesheets */
    styles: string[];
  };
  createdAt: string;
  description: {
    source: {
      body: string;
    };
  };
  id: string;
  owner: {
    id: string;
    username: string;
  };
  tags: string[];
  title: string;
  updatedAt: string;
  url: string;
};

export type FetchPensOptions = {
  cursor?: string;
  limit?: number;
  sortBy?: 'Id' | 'Popularity' | 'UpdatedAt';
  sortOrder?: 'Desc' | 'Asc';
};

export type UserProfile = {
  avatar: string;
  bio: string;
  counts: {
    followers: number;
    following: number;
    pens: number;
  };
  id: string;
  location: string;
  name: string;
  pro: boolean;
  username: string;
};

export type GetPenResponse = {
  data: {
    pen: Pen;
  } | null;
};

export type GetProfileResponse = {
  data: {
    ownerByUsername: UserProfile|null;
  };
};

export type GetPensResponse = {
  data: {
    pens: {
      pens: Pen[];
    }
  };
};

export type GraphqlPayload = {
  query: string;
};

export type GraphqlFields = Record<string, boolean | object>;

/**
 * The type of the parameters used to build a GraphQL query
 */
export type BuildQueryParams = {
  /** The GraphQL operation name (e.g. `pen`) */
  operation: string;
  /** The argument string to include in the query (e.g. `(id: "123")`) */
  args: string;
  /** The fields to include in the query */
  fields: GraphqlFields;
};
