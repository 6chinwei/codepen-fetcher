import { describe, it, expect } from 'vitest';
import CodePenGraphqlQueryBuilder from '../../src/codePenGraphqlQueryBuilder';

type ParsedQueryObject = {
  query: string;
};

describe('CodePenGraphqlQueryBuilder', () => {
  const queryBuilder = new CodePenGraphqlQueryBuilder();

  describe('buildGetPenByIdQuery', () => {
    it('should build a query for getting a pen by ID', () => {
      const penId = '12345';
      const query = queryBuilder.buildGetPenByIdQuery(penId);
      const parsedQuery = JSON.parse(query) as ParsedQueryObject;

      expect(parsedQuery.query).toContain(`query { pen (id: "${penId}") {`);
      expect(parsedQuery.query).toContain('title');
      expect(parsedQuery.query).toContain('config');
    });
  });

  describe('buildGetPensByUserIdQuery with options', () => {
    it('should build a query for getting pens by user ID', () => {
      const userId = 'user123';
      const options = { cursor: 'abc', limit: 5, sortBy: 'Id', sortOrder: 'Desc' } as const;
      const query = queryBuilder.buildGetPensByUserIdQuery(userId, options);
      const parsedQuery = JSON.parse(query) as ParsedQueryObject;

      expect(parsedQuery.query).toContain(`query { pens (input: { filters: { userId: "${userId}" }`);
      expect(parsedQuery.query).toContain('pagination');
      expect(parsedQuery.query).toContain(`cursor: "${options.cursor}"`);
      expect(parsedQuery.query).toContain(`limit: ${options.limit}`);
      expect(parsedQuery.query).toContain(`sortBy: ${options.sortBy}`);
      expect(parsedQuery.query).toContain(`sortOrder: ${options.sortOrder}`);
      expect(parsedQuery.query).toContain('pens {');
      expect(parsedQuery.query).toContain('title');
    });
  });

  describe('buildGetPensByUserIdQuery without options', () => {
    it('should build a query for getting pens by user ID', () => {
      const userId = 'user123';
      const query = queryBuilder.buildGetPensByUserIdQuery(userId);
      const parsedQuery = JSON.parse(query) as ParsedQueryObject;

      expect(parsedQuery.query).toContain(`query { pens (input: { filters: { userId: "${userId}" }`);
      expect(parsedQuery.query).toContain('pagination');
      expect(parsedQuery.query).toContain(`limit: ${CodePenGraphqlQueryBuilder.DEFAULT_FETCH_LIMIT}`);

      expect(parsedQuery.query).not.toContain('cursor');
      expect(parsedQuery.query).not.toContain('sortBy');
      expect(parsedQuery.query).not.toContain('sortOrder');
    });
  });

  describe('buildGetProfileByUsernameQuery', () => {
    it('should build a query for getting a user profile by username', () => {
      const username = 'testuser';
      const query = queryBuilder.buildGetProfileByUsernameQuery(username);
      const parsedQuery = JSON.parse(query) as ParsedQueryObject;

      expect(parsedQuery.query).toContain(`query { ownerByUsername (ownerUsername: "${username}"`);
      expect(parsedQuery.query).toContain(`ownerType: ${CodePenGraphqlQueryBuilder.CODEPEN_OBJECT_TYPES.USER}`);
      expect(parsedQuery.query).toContain('username');
    });
  });
});
