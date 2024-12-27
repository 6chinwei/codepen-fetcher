export type Pen = {
  access: string;
  config: {
    css: string;
    cssPreProcessor: string;
    head: string;
    html: string;
    js: string;
    jsPreProcessor: string;
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
  limit: number | undefined;
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
  };
};

export type GetProfileResponse = {
  data: {
    ownerByUsername: UserProfile;
  };
};

export type GetPensResponse = {
  data: {
    pens: {
      pens: Pen[];
    }
  };
};
