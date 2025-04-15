import { describe, it, expect } from 'vitest';
import CodePenGraphqlQueryBuilder from '../../src/codePenGraphqlQueryBuilder';

type Primitive = string | number | boolean;

type NestedObject<T extends Primitive = Primitive> = {
  [key: string]: T | NestedObject<T>;
};

describe('CodePenGraphqlQueryBuilder', () => {
  const queryBuilder = new CodePenGraphqlQueryBuilder();

  describe('buildGetPenByIdQuery', () => {
    it('should build a query for getting a pen by ID', () => {
      const penId = '12345';
      const query = queryBuilder.buildGetPenByIdQuery(penId);
      const parsedQuery = JSON.parse(query) as NestedObject;

      expect(parsedQuery.query).toContain('query ($id: ID!)');
      expect(parsedQuery.query).toContain('pen (id: $id)');
      expect(parsedQuery.query).toContain('title');
      expect(parsedQuery.variables).toStrictEqual({ id: penId });
    });
  });

  describe('buildGetPensByUserIdQuery with options', () => {
    it('should build a query for getting pens by user ID', () => {
      const userId = 'user123';
      const options = { cursor: 'abc', limit: 5, sortBy: 'Id', sortOrder: 'Desc' } as const;
      const query = queryBuilder.buildGetPensByUserIdQuery(userId, options);
      const parsedQuery = JSON.parse(query) as NestedObject;

      expect(parsedQuery.query).toContain('query ($input: PensInput!)');
      expect(parsedQuery.query).toContain('pens (input: $input)');
      expect(parsedQuery.query).toContain('title');
      expect(parsedQuery.variables).toStrictEqual(
        {
          input: {
            filters: { userId },
            pagination: options
          }
        });
    });
  });

  describe('buildGetPensByUserIdQuery without options', () => {
    it('should build a query for getting pens by user ID', () => {
      const userId = 'user123';
      const query = queryBuilder.buildGetPensByUserIdQuery(userId);
      const parsedQuery = JSON.parse(query) as NestedObject;

      expect(parsedQuery.query).toContain('query ($input: PensInput!)');
      expect(parsedQuery.query).toContain('pens (input: $input)');
      expect(parsedQuery.query).toContain('title');
      expect(parsedQuery.variables).toStrictEqual(
        {
          input: {
            filters: { userId },
            pagination: {
              limit: 10
            }
          }
        });
    });
  });

  describe('buildGetProfileByUsernameQuery', () => {
    it('should build a query for getting a user profile by username', () => {
      const username = 'testuser';
      const query = queryBuilder.buildGetProfileByUsernameQuery(username);
      const parsedQuery = JSON.parse(query) as NestedObject;

      expect(parsedQuery.query).toContain('query ($ownerUsername: String!, $ownerType: OwnerEnum!)');
      expect(parsedQuery.query).toContain('ownerByUsername (ownerUsername: $ownerUsername, ownerType: $ownerType)');
      expect(parsedQuery.query).toContain('username');
      expect(parsedQuery.variables).toStrictEqual({
        ownerUsername: username,
        ownerType: 'User'
      });
    });
  });

});
